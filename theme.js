import { extendTheme } from "@chakra-ui/react"

const styles = {
  global: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
}

const theme = extendTheme({
  styles,
})

export default theme
