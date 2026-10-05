const path = require("path")
const fs = require("fs")
const { authenticate } = require("@google-cloud/local-auth")

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send"
]

async function generateToken() {
  try {
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "credentials.json"),
      scopes: SCOPES
    })

    const tokenPath = path.join(__dirname, "token.json")

    fs.writeFileSync(
      tokenPath,
      JSON.stringify(auth.credentials, null, 2)
    )

    console.log("")
    console.log("Gmail OAuth authentication successful.")
    console.log("token.json has been created.")
    console.log("")
  } catch (error) {
    console.error("")
    console.error("OAuth authentication failed.")
    console.error(error.message)
  }
}

generateToken()