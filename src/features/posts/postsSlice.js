import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { client } from '../../api/client'


const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const responce = await client.get('fakeApi/posts')
    return responce    
})

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
      // We send the initial data to the fake API server
      const response = await client.post('/fakeApi/posts', { post: initialPost })
      // The response includes the complete post object, including unique ID
      return response.post
    }
  )

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action){
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        }
    },
    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
          state.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          state.posts = action.payload.posts
        },
        [fetchPosts.rejected]: (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        },
        [addNewPost.fulfilled]: (state, action) => {
            // We can directly add the new post object to our posts array
            state.posts.push(action.payload)
        }
    }
})


export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => {
    return state.posts.posts.find(post => post.id === postId)
}

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)