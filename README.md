# infrastructure

## Dark Crawler

> Most hidden wikis are just scam directories. The sights that do not work are most likely just forgotten about sites that have went down. If you want to actually explore onions, find **Daniel's directory link**. I would give it to you, but I don't have it.
> -- <cite>reddit, [ewna843](https://www.reddit.com/r/TOR/comments/cp59a5/is_there_any_way_to_make_more_of_the_hidden_wiki/ewna843/)</cite>

The crawler gather onions from Daniel's directory and put them in a stack.
While the stack is filled, the crawler pop website from the stack and visit some pages of this website. 
From this website the crawler gather links to other websites and put them at the end of the stack. They are added only if they have not been visited.

The crawler also takes screenshot of visited websites and replace all NSFW images using a classifier, this is to prevent any harmful material being shown. Be aware that this classifier is not perfect, it use nsfw.js underhood.
The crawler only accept html, stylesheets, images and fonts, other ressources requests, like scripts are intercepted and aborted to prevent any unwanted exposure.

Here is the pseudo-code:

```
stack = daniel_websites

while stack not empty
  website = pop stack
  visit website
  remove_nsfw_images website
  screenshot website
  stack = stack + extractlinks website
```

In order to speed up the crawling, multiple instances of the crawler can be launched, this is done using only one browser and multiple pages.

### Usage

After installing docker, go to the dark-crawler folder and execute this command:

```
docker-compose up -d
```

Then, serve the website and you will see the dark crawler in action.
