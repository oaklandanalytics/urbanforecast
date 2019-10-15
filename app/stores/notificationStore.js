import { action, extendObservable } from 'mobx'

const NotificationStore = function() {
  extendObservable(this, {
    notifications: [],

    enqueueSnackbar: action(note => {
      this.notifications.push({
        key: new Date().getTime() + Math.random(),
        ...note,
      })
    }),

    removeSnackbar: action(note => {
      this.notifications.remove(note)
    }),
  })
}

export default new NotificationStore()
