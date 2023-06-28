# When is BetterEdit 5 coming out?
> Posted by HJfod on 28/06/2023

BE 5 was first mentioned - oh shit, nearly 2 years ago. Given that at this point this one update to a mod has taken as long as [Geode](https://geode-sdk.org), what is up? **Why is BE 5 still not out yet? When is it coming out?**

The answer is a little disappointing: **possibly never**.

Let me explain.

## Version 5??

The original idea for BE 5 was to be a complete rewrite of BetterEdit from scratch. By the time v4.0.5 was released, the mod was full of long-standing bugs, crashes, instability and performance issues, and largely all of it was caused by the same reason: **the codebase was getting really huge**. The central tool that makes mods work are *hooks*; a typical mod contains around a few, maybe a few dozen of them. For context, the entire [Geode mod loader](https://github.com/geode-sdk/geode) has only ~25 hooks. **BetterEdit v4 has over 100.**

BetterEdit was (and still is) one of the largest mods ever made in terms of code, beaten perhaps only by Mega Hack. However, the codebase was not built to manage that amount of features, especially with the techniques used at that time; dozens of folders with files that depended on each other in completely non-linear, non-obvious ways. Where is this central feature that 10 others depend on? Well, of course it's in [`EyeDropper`](https://github.com/HJfod/BetterEdit/blob/v4/tools/EyeDropper/updateHook.cpp#L56), because that's where I first needed it!

It was clear to me from early on that eventually BetterEdit would need a complete rewrite if I wanted any chance of maintaining the mod in the future. However, the rewrite would also obviously take a very long time to complete, so I wanted to make sure I did it right. I wanted to make sure that BE 5 would not only be great, but that it would also be the last rewrite BetterEdit would ever need.

## The flower that bloomed into a rock

Geode, then known by its deadname Lilac, was started in Summer 2021 due to reasons that would take way too long to explain in this post; read [Why BE 5 is Geode-only?](why-is-betteredit-5-geode-only.html) for a brief explanation on that. The idea behind Geode was that it would be a brand new mod loader, which would fix many of the issues mods were facing due to the way they were made. Unfortunately, there was a tradeoff: Geode could only load mods specifically built for it, and no other mod loader could load Geode mods. While this was for a good reason, it did mean that the mod loader would be worthless if we couldn't get the big mods ported over to it.

Fortunately for Geode, out of the big mods of 2021 (Mega Hack, BetterEdit, GDShare, TextureLdr, Run Info, etc.), most were made by people who were now lead developers for Geode and as such enthusiatic about porting their mods over. We also got confirmation early on that Absolute would be willing to port Mega Hack. Now, porting mods over to Geode in the worst case requires completely rewriting them from scratch; however, BE was already going to be rewritten from scratch anyway, so this wasn't an issue for it. Even moreso, since I was both the developer of BetterEdit and _de facto_ team lead of Geode, **BetterEdit 5 was going to be a fantastic launch title & killer mod for Geode that would promote both the loader and the mod**.

## Then it took a while

This was the plan I went with from the start. Every time someone asked "When's the next BetterEdit update coming out?", I would answer "BE 5 will be on Lilac and it will be great!" Just one small issue: Lilac was nowhere near usable. Even by November 2021, no one had ever actually loaded any mod with Lilac - that was all still in the concept stage. As such, the beginning of a major rewrite for a mod loader that wasn't even usable yet would prove... well, it wasn't going to happen.

In the meanwhile, I started working on BetterGD, a shared mod loader / modding API for my own mods, that eventually reached the point where it was doing the job Lilac was supposed to do. After asking myself "Wait why am I the lead developer on two mod loaders that do the same thing?", BetterGD got merged into Lilac. Soon after, another modding framework named Cacao got merged into Lilac aswell, and the framework was renamed to Geode.

Thanks to the merging of BetterGD, Lilac was now actually somewhat functional, and after Cacao was merged we got to the point of actually writing some of the first mods for it. However, the framework was still really unstable. If you wrote a mod, within a week it would no longer work because a core component of the loader had been changed. Sometimes mods would have to be updated multiple times within a single day, because the framework kept evolving all over the place.

But eventually, Geode started to look stabile. After months of tireless work, the framework had gotten to the point that I felt like it was safe to start the massive process of writing all of BetterEdit all over again. So I created a new Geode project on my computer for the update, and started working. Unfortunately, between the time I first announced Lilac and BE 5, and the time I actually started working on it, **an entire year had passed**.

Yeah, it turns out that the reason Hyperdash never came out is because making a cross-platform mod loader and modding framework is really hard!

And even when I started finally working on BE 5, it wasn't like I could then just focus all my efforts on writing it. No, major parts of Geode were still missing, and some of them parts that I really needed for BE - so my development was spending an hour on BE, realizing I was missing a feature, and then spending a week on Geode adding things I need and fixing existing parts that didn't actually work. By December 2022, I had completely halted working on BE 5 because Geode was still in such bad shape that I practically still couldn't use it for BE.

However, eventually, the new year rolled around, and around March, all of the missing features for BE had finally been added to Geode, and as such, I could get back to working on BE 5. And so I did - until...

## Oh, hi Ms. Burnout!

Yeah. I had experienced burn out from programming before. Just looking at my Github activity, one can easily notice short periods of a few weeks when I just wasn't feeling it. However, these periods were sparse - only a week or two long, and they were followed by huge activity peaks.

This time feels different.

I can not find any energy to work on BetterEdit, let alone Geode or GDShare or any other mod. I can't even open up VS Code without being overcome by an immense sense of dread and tiredness. Just putting this blog site together was a bit of a drag, despite it being [a JS file with 50 lines of code](https://github.com/HJfod/blog/blob/main/build/build.js) and some CSS I copied off older projects.

As if that wasn't enough, my free time has gotten shorter and shorter. I used to spend all day long on my computer writing code - in Summer 2021 I regularly had VS Code open for 10+ hours a day. However, nowadays I have [civil service](https://en.m.wikipedia.org/wiki/Siviilipalvelus) to do, as well as a ton of other hobbies that would leave me unable to work as much as I used to on BE even if I wanted to.

## So what about BE?

It's possible this burnout is like all the other times in the past and in a few weeks I'll be blasting commits to Github like my life depended on it. However, I certainly don't feel like that right now. **If I ever get back to finishing BE 5, it will be a welcome surprise, not an eventuality.**

As such, to save you from having to read between the lines: **I can't promise BE 5 will ever be released**. I probably won't release another mod again - especially with 2.2 seemingly looming in the near future for real this time, which _for low-level programming reasons_ will completely kill all modding for a while.

However, I would like to note that [BE 5 is open-source](https://github.com/hjfod/betteredit) - if other modders want to take it over, [I will be accepting Pull Requests](https://github.com/HJfod/BetterEdit/pulls). Or if someone wants to fork it and make EvenBetterEdit, they are free to do so. I'm also open to the idea of turning BetterEdit into a collaborative project, where I'd just share the ideas I've had for it and suggestions, and maybe design the UX for features - although I doubt any other modders would be up for that :P

## To close off

The reason I wanted to make this post is because I've instinctively kept saying "ye I can add that" to people requesting BE features in the hopes that I'd get back to working on it some day, while knowing that I probably will never be able to deliver on that promise. Sorry to all the people this news disappoints, and congratulations to all the haters who thought this was gonna happen!

That's about it. Cya ;)

-HJfod
