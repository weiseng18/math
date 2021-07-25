import React, { useEffect } from "react"

export const MathTypeset = () => {
  useEffect(() => {
    MathJax.typeset()
  }, [])
  return <></>
}

export const Imports = () => {
  return (
    <>
      <script type="text/javascript" src="/mathjax-config.js"></script>
      <script
        type="text/javascript"
        id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js"
      ></script>
    </>
  )
}
