import { createSlice } from '@reduxjs/toolkit'

export const openedWindowsSlice = createSlice({
  name: 'openedWindows',
  initialState: [],
  reducers: {
    open: (ref, raction) => {
      const { payload: action } = raction
      switch (action.action) {
        case 'push':
          if (ref.indexOf(action.window) === -1) {
            ref.push(action.window)
            break
          }
        case 'focus':
          if (ref.indexOf(action.window) === ref.length - 1) return ref
          ref.splice(ref.indexOf(action.window), 1)
          ref.push(action.window)
          break;
        default:
          ref.splice(ref.indexOf(action.window), 1)
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { open } = openedWindowsSlice.actions

export default openedWindowsSlice.reducer