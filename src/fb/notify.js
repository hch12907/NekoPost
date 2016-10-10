"use strict"

// Dependencies
import FB from 'fb'

// Configs
import { fbConf } from '../../config'

export default (userid, message, href) => {
  return new Promise(async (resolve, reject) => {

    FB.options({ version: 'v2.8' })

    const app = await FB.api('oauth/access_token', {
      client_id: fbConf.appId,
      client_secret: fbConf.appSecret,
      grant_type: 'client_credentials'
    })
    
    FB.setAccessToken(app.access_token)
    
    if(href) {
      
      const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
      const link = urlregex.exec(href) ? urlregex.exec(href) : ''
      
      if(link) {
       
       try {
          const response = await FB.api(`/${userid}/notifications`,
            'post',{
              template: message,
              href: href
            })
          resolve(response)
        } catch(error) {
          if(error.response.error.code === 'ETIMEDOUT') {
            reject('request timeout')
          } else {
            reject(`error: ${error.message}`)
          }
        }
      }
      
    } else {
      
      try {
        const response = await FB.api(`/${userid}/notifications`,
          'post',{
            template: message
          })
        resolve(response)
      } catch(error) {
        if(error.response.error.code === 'ETIMEDOUT') {
          reject('request timeout')
        } else {
          reject(`error: ${error.message}`)
        }
      }
      
    }
  
  })
}
