const controllers = {}

controllers.get = (_, response) => {
  return response.status(200).json({ healthcheck: 'live' })
}

export default controllers
