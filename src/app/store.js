import { configureStore } from '@reduxjs/toolkit'
import postsSlice from '../features/posts/postsSlice'
import usersSlice from '../features/users/usersSlice'
import notificationsSlice from '../features/notifications/notificationsSlice'


export default configureStore({
  reducer:{
    posts: postsSlice,
    users: usersSlice,
    notifications: notificationsSlice,
  }
})
