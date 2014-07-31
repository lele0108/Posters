# Lob and Stripe API

RESTful API built using Lob and Stripe to charge customers and print posters

Built by the fine folks at Hacker Supply Co.

Requires MongoDB.

##API usage:

###POST /api/buy:

####parameters:
name: String<br>
address_line1: String<br>
address_line2: String (optional)<br>
address_city: String<br>
address_state: String<br>
address_zip: Number<br>
address_country: String<br>
email: String<br>
phone: Number<br>
stripe_token: String<br>

####response:
200OK<br>
{<br>
  "message": "Poster has been purchased and sent to printing! Confirmation #53d9e20a345ef2aa0f000001"<br>
}<br>

### GET /api/status/:confirmation

####paramters:
confirmation: String (MongoDB _id)

####response:
200OK<br>
Status: processed, Packaging: Smart Packaging<br>

##License
(The MIT License)

Copyright (c) Jimmy Liu.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

