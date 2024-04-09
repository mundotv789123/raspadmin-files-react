import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps (ctx: DocumentContext) {
    return await ctx.renderPage();
  }

  render () {    
    return (
      <Html>
        <Head>
            <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
