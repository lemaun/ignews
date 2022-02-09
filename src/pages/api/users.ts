import { NextApiRequest, NextApiResponse } from "next"

// JWT (Storage)
// Next Auth (Social - sem armazenamento de dados do usuário)
// Cognito, Auth0

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id:1, name: 'Diego'},
    {id:2, name: 'Dani'},
    {id:3, name: 'Rafa'},
  ]

  return response.json(users)
}
