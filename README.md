# infrastructure

## Dark Crawler

> Most hidden wikis are just scam directories. The sights that do not work are most likely just forgotten about sites that have went down. If you want to actually explore onions, find **Daniel's directory link**. I would give it to you, but I don't have it.

The crawler gather onions from Daniel's directory and put them in a stack.

While the stack is filled, the crawler pop website from the stack and visit some pages of this website. 
From this website the crawler gather links to other websites and put them at the end of the stack. They are added only if they have not been visited.

The crawler also takes screenshot of visited websites and blur each images, to prevent any harmful material being shown.

The crawler only accept html, stylesheets, images and fonts, other ressources requests, like scripts are intercepted and aborted to prevent any unwanted exposure.

