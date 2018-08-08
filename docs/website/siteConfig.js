/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const users = [
  {
    caption: 'sailfm',
    image: '/img/docusaurus.svg',
    infoLink: 'https://sail.fm',
    pinned: true
  }
]

const siteConfig = {
  title: 'Sqorn',
  tagline: 'A Javascript Library for Building Composable SQL Queries',
  url: 'https://sqorn.org',
  baseUrl: '/',
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'Sqorn',
  organizationName: 'eejdoowad',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'tutorial', label: 'Tutorial' },
    { doc: 'api', label: 'API' },
    // { doc: 'examples', label: 'Examples' },
    { doc: 'faq', label: 'FAQ' },
    { page: 'demo', label: 'Demo' },
    // { doc: 'benchmarks', label: 'Benchmarks' },
    { href: 'https://github.com/eejdoowad/sqorn', label: 'Github' }
    // { blog: true, label: 'Blog' }
  ],

  algolia: {
    apiKey: '4f6441bc3ef3f696189b04d115eef1a1',
    indexName: 'sqorn',
    algoliaOptions: {} // Optional, if provided by Algolia
  },

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.png',

  /* colors for website */
  colors: {
    primaryColor: '#2979ff',
    secondaryColor: '#75a7ff'
  },

  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: 'Copyright © ' + new Date().getFullYear() + ' Sufyan Dawoodjee',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'vs'
  },

  // Add custom scripts here that would be placed in <script> tags
  scripts: ['https://buttons.github.io/buttons.js'],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png'

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

module.exports = siteConfig
