# P2P VPS - Server

## What is P2P VPS?
P2P VPS aspires to create a peer-to-peer (P2P) marketplace offering Virtal
Private Servers (VPS), similar to
[Digital Ocean](http://digitalocean.com) or [Vultr](http://vultr.com). This
would also be similar
to co-location services like
[Raspberry Pi Hosting](https://raspberry-hosting.com/en) or
[Mythic Beasts](https://www.mythic-beasts.com/order/rpi).
However, instead of using a data center,
the marketplace would use an array of psudo-anonymous IoT devices (like the
[Raspberry Pi](https://www.raspberrypi.org/))
hosted by people participating in the marketplace. Anyone
with an internet connection and a device capable of running
[Docker](https://www.docker.com/) can rent
that device in the P2P VPS marketplace.

While [the applications of such a network](https://raspberry-hosting.com/en/applications)
are similar, the P2P VPS marketplace will never have the speed or reliability
of the commercial outfits linked above. Instead, the focus of P2P VPS is to
create a decentralized network of anonymous web servers, capable of delivering
websites or web apps, in order to prevent censorship and promote free speech.

Members participating in the marketplace can earn cryptocurrency by renting out
their device, while helping to create a more decentralized internet at the same time.
That's the focus of the P2P VPS network. In this way, the P2P VPS software is
censorship-fighting software similar to, but very different from,
[TOR](https://www.torproject.org/).

For more information, [read the full documentation](http://p2pvps.org/documentation/)

## About This Repository
This repository is the server-side software needed to host a P2P VPS marketplace
on your own server. The repository was customized from a forked copy of the [vue-connextcms-site-template](https://github.com/skagitpublishing/vue-connextcms-site-template)
repository. The P2P VPS software suite is composed of three software packages:

1. *The Client* software runs on any computer and allows the device to be rented
on the marketplace.
2. *The Server* software includes the database models, REST APIs, website content,
and Vue.js marketplace app.
3. *Server Deployment* is a collection of Docker containers used to easily deploy
copies of the Server.

[The Client software can be found here](https://github.com/P2PVPS/p2pvps-client).
This repository contains *The Server* software.

### File Layout
* The `site-template-connextcms/` directory contains the ConnextCMS site template
files needed to create database models and REST APIs required
to coordinate Clients and persist data. For more information, see the
Readme for [ConnextCMS Site Templates](https://github.com/skagitpublishing/site-template-connextcms).

* The user interfaces used to add devices and rent them are designed from
Vue.js applications bundled through Webpack. The code for these applications
live in the `src` directory. For additional details on Vue.js template used, see the [vue-connextcms-site-template](https://github.com/skagitpublishing/vue-connextcms-site-template)
repository.

## Build Setup
For detailed explanation on how the build commands work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# build as a site template for ConnextCMS
npm run connextcms

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Installation
Follow the instructions below to generate a ConnextCMS site template and serve your new site template through ConnextCMS.
It is assumed you are building on a server running Ubuntu Linux.

1. Install the [server deployment](https://github.com/P2PVPS/server-deployment)
repository before installing this repository. The scripts in this repository
assume that the `docker-connextcms` repository is cloned in your non-root user home directory, e.g. `~`

2. Install Node.js and NPM on your machine. [This tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)
shows how to install it on a Digital Ocean Droplet. The code in this repository has been tested against Node v8.x LTS.

3. After cloning this repository, run `npm install` to install dependencies and then `npm run connextcms` to build
the ConnextCMS site template.

4. Generate your site template by running the following script:
`./generateSiteTemplate`

5. Copy the site template into the `~/server-deployment/theme/site-template-connextcms`
directory by running the following script: `./uploadToConnextCMS`

6. If the ConnextCMS docker container is running, bring it down by changing directory
into `~/server-deployment/` and
running the command `docker-compose down`. After that completes, bring it back up
with `docker-compose up -d`. ConnextCMS
will boot. The standard site template is available at port 3000. The Vue app is
available at path `/appdashboard`. To
bring the Vue app up in a web browser, navigate to
`http://xxx.xxx.xxx.xxx:3000/appdashboard`. Replace the x's with the IP
address of your server.


## License
(The MIT License)

Copyright (c) 2017 [Chris Troutner](http://christroutner.com) and [P2P VPS Inc](http://p2pvps.org)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
