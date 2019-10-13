<!--
https://www.iheart.com/podcast/105-stuff-you-should-know-26940277/episode/how-the-deep-web-works-29467636/
-->

<template>
    <slide>
      <template v-slot:title>DarkWeb</template>
      <template v-slot:pinboard>
        <pinboard position-src="assets/json/slides_positions.json">
        <template v-if="slide === 1">
          <div v-dragged id="text1" class="text">
            <remarkable>
Many believe Google search can identify most of the information available on the Internet on a given subject. But there is an entire online world – a massive one – beyond the reach of Google or any other search engine.
# Enter the void
Accessing the Dark Web requires encryption service like **Tor, I2P and Freenet** which uses a random path of encrypted servers also known as nodes that theoretically allows users to connect to the Dark Web while remaining anonymous.
            </remarkable>
          </div>
          <div v-dragged id="text2" class="text">
            <remarkable>
## The Onion Router aka TOR
Created by the DARPA (Advanced Defense Research Projects Agency) between 1994 and 1997, was released under a public license. It uses an "onion routing" with several sofas of encryption.

### .onion
Onion addresses doesn’t exist in Internet's Domain Name System (a directory of all addressess owned by Governments). But using specific proxy software, applications like web browsers can access .onion websites by requesting through Tor Network.

## The Anonymous Icognito Live System
The TAILS system is a complete stand-alone Linux system, easy to install on a USB stick. It allows you to start a computer without touching its data, and to have a browser (Firefox), a chat software (Pidgin), and a whole range of other software allowing you to use the services from the Internet, but only through Tor.
            </remarkable>
          </div>
          <div v-dragged id="text3" class="text">
            <remarkable>
## Dark Net Markets (DNMs)
Dark Net Markets (DNMs) are websites found on the Dark Net that facilitate the anonymous trade of illegal items such as drugs and weapons. Despite repeated law enforcement
interventions on DNMs, the ecosystem has continued to grow since the first DNM, Silk
Road, in 2011.

### Dark Net Reddit

Dread is a reddit like forum on the Dark Net. All features are mimicked without the use of any JavaScript. Dread was made by a reddit user known as ‘HugBunter’, he has been inspired by the recent ban of the ‘darknetmarkets’ subreddit.
</remarkable>
          </div>
          <div v-dragged id="text4" class="text">
            <remarkable>
## Currencies
Litecoin, Dogecoin, Darkcoin and Monero. Cryptocurrencies are online currencies built around a
cryptographic protocol that allows them to be spent and received. Each of these currencies is decentralised, meaning that transactions are approved through a community of
users, instead of a designated authority. 

This feature means that the transactions cannot
be regulated by law enforcement or similar actors e.g., transactions cannot be blocked
or accounts closed in the same way that PayPal, for instance, will freeze accounts they
suspect are linked to illegal activity.
            </remarkable>
          </div>
          <div v-dragged id="text5" class="text">
            <remarkable>
## Government Task Forces
Police all over the world have deployed a wide array of different techniques to identify and ultimately convict dark web drug dealers, weapon buyers, child pornographers, whistleblowers, political opponents and more in the past several years.
- Going undercover
- Hacking
- Open source information
- Mass surveillance
- Digging through seized data
- Following the money
- Postal system

Instead of intercepting communication between the drug sellers and drug buyers, they prefer to work together with sellers (taking considerate money for 'protection') and arrest some proportion of buyers when they go for the drop.
            </remarkable>
          </div>
          <div v-dragged id="text5-1" class="text">
            <remarkable>
## Deanonymize
There are a number of known vulnerabilities, that have been used, to deanonymize Tor users via leveraging JavaScript.

The first major incident where this happened was with the "Freedom Hosting" seizure by the FBI. The FBI kept servers online, and then installed javascript paylods which exploited a zero-day exploit in Firefox. This caused the computers to call back to an FBI server from their real, non-anonymized IP, leading to the deanonymization of various users. You can read more about it in Ars Technica.

In general, enabling JavaScript opens the surface area for many more potential attacks against a web browser. In the case of a serious adversary like a state-backed entity (e.g. the FBI), they have access to zero-day exploits. If the vectors for these zero-days are disabled (e.g. JavaScript), then they may be hard pressed to find a viable exploit even if they have access to zero days etc.
            </remarkable>
          </div>
          <div v-dragged id="text6" class="text">
            <remarkable>
## Hacktivism

[Edward Snowden, 2015][1]
> Tor is a critical technology, not just in terms of privacy protection, but in defense of our publication right -- our > ability to route around censorship and ensure that when people speak their voices can be heard  

[1]:https://blog.torproject.org/what-tor-supporter-looks-edward-snowden

Hacktivists are defined as actors who use “technology hacking to effect social change.” Their efforts include
Internet Relay Chat discussions, distributed denial of service attacks, the production of propaganda
videos, and the proliferation or mirroring of censored content (Fish, 2016).

            </remarkable>
          </div>
          <div v-dragged id="text7" class="text">
            <remarkable>
## Dead drops -- Postal system

The use of “dead drops” is an alternative to the postal system which has proven vulnerable to tracking and interception. Now, goods are hidden in publicly accessible places like parks and the location is given to the customer on purchase. The customer then goes to the location and picks up the goods.

### Russia 

In Russia Tor-based marketplaces with dead drops in parks and around the city have been around since 2013 and are now the only practical way to buy any drugs. Telegram channels have been widely used since at least 2015. 

Any city park has police squads patrolling the exits at night - they search people, open up your phone and look up Telegram and Tor apps if they suspect you've gone there to get a drop. 

Drops (they're actually called "buried treasure", or "klad" here) moved from parks to the city - you get instructions, for example, to go to some floor of a random apartment building, stop the elevator and search for a magnet-attached package behind it's doors.
            </remarkable>
          </div>
          <div v-dragged id="text8" class="text">
            <remarkable>
## Groups
- [Anonymous](https://en.wikipedia.org/wiki/Anonymous_(group)) - Anonymous is a loosely associated international network of activist and hacktivist entities.
- [LulzSec](https://en.wikipedia.org/wiki/LulzSec) - Lulz Security, was a black hat computer hacking group that claimed responsibility for several high profile attacks, including the compromise of user accounts from Sony Pictures in 2011.
- [Cicada 3301](https://en.wikipedia.org/wiki/Cicada_3301) - Cicada 3301 is a name given to an enigmatic organization that has posted a set of complex puzzles and alternate reality games to recruit codebreakers from the public, the puzzle has been called "the most elaborate and mysterious puzzle of the internet age".
- [Decocidio](https://en.wikipedia.org/wiki/Decocidio) - Decocidio is an anonymous, autonomous collective of hacktivists which is part of Earth First!, a radical environmental protest organisation, and adheres to Climate Justice Action.
- [Milw0rm](https://en.wikipedia.org/wiki/Milw0rm) - Milw0rm is a group of hacktivists best known for penetrating the computers of the Bhabha Atomic Research Centre (BARC) in Mumbai, the primary nuclear research facility of India.
            </remarkable>
          </div>
          <div v-for="(text, index) in texts" :key="text" v-dragged :id="text" class="text">
            <h3>Testimonial {{ index + 1 }}</h3>
            <remarkable>{{ text }}</remarkable>
          </div>
          <div v-for="service in services" :key="service" v-dragged :id="service"  class="service">
            <img :src="service" />
          </div>
          <div v-for="image in images" :key="image" v-dragged :id="image"  class="image">
            <img :src="image" />
          </div>
        </template>
        <template v-if="slide === 2">
          <div style="grid-row: span 2">
            <remarkable>
              # Enter the void
              Accessing the Deep Web requires encryption service like **Tor, I2P and Freenet** which uses a random path of encrypted servers also known as nodes that theoretically allows users to connect to the Deep Web while remaining anonymous.
            </remarkable>
          </div>
          <div v-for="service in services" :key="service" class="image">
            <img :src="service" />
          </div>
        </template>
        </pinboard>
      </template>
    </slide>
</template>

<script>
module.exports = {
  components: {
    slide: httpVueLoader("src/components/slide.vue"),
    pinboard: httpVueLoader("src/components/pinboard.vue")
  },
  data() {
    return {
      slide: 1,
      services: [
        "assets/images/logos/Nets/1200px-Tor-logo-2011-flat.svg.png",
        "https://cdn2.i-scmp.com/sites/default/files/images/methode/2017/07/22/fb5a5e12-6ea5-11e7-9575-882aa2208a4d_972x_143638.JPG",
        "assets/images/logos/Economy/Darkcoin_official_logo.png",
        "assets/images/logos/Economy/monero-logo-1280.png",
        "https://www.eteknix.com/wp-content/uploads/2015/05/Silk-Road-Marketplace-Camel-e1432984816910.png",
        "https://untappedcities-wpengine.netdna-ssl.com/wp-content/uploads/2011/02/deaddrops1-600x4001.jpg",
        "https://pbs.twimg.com/profile_images/96386415/icon80_400x400.png",
        "assets/images/logos/Taskforces/uspis-logo.png",
        "assets/images/logos/Taskforces/1200px-Seal_of_the_Federal_Bureau_of_Investigation.svg.png",
        "https://media.wired.com/photos/5cd34166dd05f045b7113bb5/master/w_1600%2Cc_limit/Dark-Web-Inline2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Logo_politie.svg/1280px-Logo_politie.svg.png",
        "https://upload.wikimedia.org/wikipedia/fr/a/a5/Europol_ectc_rgb_transparent_horizontal_version.png",
        "https://eumostwanted.eu/sites/all/themes/eumwfoundationtheme/enfast_page/enfast.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Tails-logo-flat-inverted.svg/374px-Tails-logo-flat-inverted.svg.png",
        "https://qph.fs.quoracdn.net/main-qimg-89f626e5e2039c9367ea2ded87b5d1a3",
        "https://www.europol.europa.eu/sites/default/files/images/editor/2_2.jpg",
      ],
      images: [
        "assets/images/screen/Screen Shot 2019-09-07 at 18.12.33-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-07 at 17.57.58-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 18.37.16-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 19.09.58-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 18.56.38-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 16.52.31-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 17.46.43-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-07 at 18.37.15-fullpage.png",
        "assets/images/screen/Screen Shot 2019-09-08 at 16.41.21-fullpage.png",
        "https://o.remove.bg/downloads/d1436d60-c3b1-47e3-8364-09fa53a405a5/RandomDarknetShopper_item17_1_1280-removebg-preview.png",
        "https://o.remove.bg/downloads/64fbb0b8-7f61-4a24-a0c4-69aa4b6881a9/Screenshot_2019-10-07_at_01-removebg-preview.png",
        "https://upload.wikimedia.org/wikipedia/commons/8/84/Aging_Anonymous.jpg",
        "https://mascherari.press/content/images/2016/07/onionscan-tr1.png"
      ],
      texts: [
'I live in Iran and I have been using Tor for censorship circumvention. During political unrest while the government tightens grip on other censorship circumvention alternatives, Tor with obfuscation plugins remain the only solution. Tor changed my personal life in many ways. It made it possible to access information on Youtube, Twitter, Blogger and countless other sites. I am grateful of Tor project, people working on it as well as people running Tor nodes.',
`I'm a student in Hong Kong, you might call me an activist as well. I use Tor to fight for our city to retain some of the democracy we currently enjoy. Many people confuse our movement with trying to bring Britain back or something like that. It's never been about Britain or China per se, it's about being able to decide our own future instead of being ruled by autocrats from a far off city.

I have heard of others in my place who are now under investigation or possibly facing jail time, this isn't a risk I can take. Thank you, Tor Project. There are certainly improvements to be made with the Bundle, such as its JavaScript settings, Punycode, etc. but without it my life might've been over by now. Thanks.`,
`I live in Iran. I use tor for telegram, accessing social medias and most of all be anonymous! 

Tor helped me in Censorship circumvention, Political organizing(view and comment my ideas without fear!), Coping with domestic abuse or stalking (in Iran it is our ISP's), Curtailing surveillance (again from our regime), Whistleblowing or anti-corruption reporting(our gun is our mobiles and social medias). 

And beside Tor for us is more than keep our privacy! When regime tries to block all anti filters, Tor is the only tool to connecting social medias and free internet. and also there were times that tor was blocked and I used bridges with email robot to connecting tor. At the end tor worked for me 98% success and for other 2% I used email robot(bridges). and also I use tor proxy as tor browser(50% proxy and 50% browser)! We(all Iranians). Thank you for Tor.
`,
"# Dark markets have evolved to use encrypted messengers and dead-drops"
      ],
      categories: [
        {
          name: "Address",
          component: "dark-address"
        },
        {
          name: "Money",
          description:
            "Accessing the Deep Web requires encryption service like Tor, I2P and Freenet which uses a random path of encrypted servers also known as nodes that theoretically allows users to connect to the Deep Web without while remaining anonymous."
        },
        {
          name: "Mail Service",
          description:
            "A marketplace website hosted on a darknet (such as Tor), setup to provide the sale of goods and services while maintaining anonymity of vendors and buyers; also known as a cryptomarket."
        },
        {
          name: "Leaks",
          description:
            "A marketplace website hosted on a darknet (such as Tor), setup to provide the sale of goods and services while maintaining anonymity of vendors and buyers; also known as a cryptomarket."
        },
        {
          name: "Marketplaces",
          description:
            "A marketplace website hosted on a darknet (such as Tor), setup to provide the sale of goods and services while maintaining anonymity of vendors and buyers; also known as a cryptomarket."
        },
        {
          name: "Counterfeits",
          description:
            "A marketplace website hosted on a darknet (such as Tor), setup to provide the sale of goods and services while maintaining anonymity of vendors and buyers; also known as a cryptomarket."
        }
        // "Police",
        // "Politics",
        // "Hacktivist Groups",
        // "Anonymity",
        // "Whistleblowers",
        // "Security",
      ]
    };
  }
};
</script>

<style scoped>
.nav {
  position: fixed;
  bottom: 1em;
  right: 1em;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  cursor: pointer;
  color: green;
  z-index: 9999999;
}

.text {
  font-size: 10px;
  width: 20em;
  z-index: 9;
}

blockquote {
  margin: 0;
  margin-left: 1em;
}

h2 + ul, h2 + ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}

h2 + ul {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
  width: 20em;
}

.service {
  max-height: 8em;
}

.service img {
  max-height: 8em;
  max-width: 10em;
  filter: grayscale(1);
}

.image {
  z-index: 1000000;
}

.image img {
  max-width: 30em;
}
</style>
