export const getRootURL = () => {
  const { HTTPS, HOSTNAME, PORT } = process.env;
  return (
    `http${HTTPS ? 's' : ''}://${HOSTNAME}${PORT ? ':' + PORT : ''}`
  )
}