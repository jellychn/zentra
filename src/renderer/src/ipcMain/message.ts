export const sendIpcMessage = ({
  message,
  data = {}
}: {
  message: string
  data?: unknown
}): void => {
  window.api.send(message, data)
}

export const receiveIpcMessage = ({ message }: { message: string }): void => {
  window.api.on(message, (data) => {
    console.log('Backend replied:', data)
  })
}
