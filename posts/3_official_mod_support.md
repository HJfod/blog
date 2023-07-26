# What if Geometry Dash had Official Mod Support?
> Posted by HJfod on 26/07/2023

GD does not have any sort of built-in support for mods. Everything from Mega Hack to BetterEdit and Geode is 100% made by and made possible by the community - with thousands of collective hours sunk into making modding possible. This does come with the benefit that **we are basically able to do whatever we want**; mods have practically infinite freedom to do whatever their developer sees is needed in the game, which is great. However, it also comes with severe downsides. The long-awaited release of **2.2 will cripple the modding scene**, as every mod loader, every mod and every library has to be manually updated to the new update, along with all the reverse engineering work redone to figure out what has changed.

Given this, every now and then someone on the [GD Programming](https://discord.gg/gd-programming) suggests that RobTop should add official mod support to the game (and RobTop has said before that he would be interested in doing that). The benefits of this would be numerous; updating mods to new updates would be much simpler, a lot of things that are currently hard to mod would likely be given official APIs, and we wouldn't have to worry about mod loaders being incompatible with each other, as everyone would obviously only use the official one.

Well, that is, if the official API is designed right - which I believe to be of upmost importance. One disadvantage that an official API would have in any case is that it would be entering an existing market - **there are already a ton of GD mods out there**, many which depend heavily on certain aspects of the current modding scene. **If the official API can't support most mods people use, people will go back to using community-made mod loaders.** This would undermind the very point of the official API - to centralize modding.

In this post, I want to explore a few different ways I imagine an official API could look like, their benefits and downsides, and in the end give my thoughts on what I think would be the best fit. Of course, I can only speculate on what RobTop actually wants from the API if he ever adds it - however, I will giving each alternative a score on four points that I believe RobTop would find the most important: **safety**, **freedom**, **ease of use**, and **ease of implementation**.

 * **Safety** describes how secure the API is; that is, whether you can load untrusted mods without being afraid of getting a virus. Being safe is obviously a major upside for an official API whose mods would be used by millions of individuals.
 * **Freedom** is all about how much possibilities the API covers. There are a lot of different mods out there, some with very nïche requirements. An API that supports these mods with as few compromises as possible allows for the creativity of modders to shine.
 * **Ease of use** is simply how easy to API is to learn and use. A beginner-friendly API would allow less experienced people with great ideas to more easily turn their ideas into a reality, fostering a more healthy ecosystem.
 * **Ease of implementation** is how easy the API would be for RobTop to actually make and maintain.

It should be noted that the first three goals are contradictory. In fact, I have conjectured that **no modding API can ever satisfyingly meet all three**. An API that is both safe, easy to use, and capable of supporting the majority of existing popular mods simply can not exist.

To illustrate this, I want to highlight two very troublesome aspects of the current modding scene in particular: **bugfix mods** and **Mega Hack v7**.

Bugfix mods, by nature, augment existing code in GD and make it do something else. Usually this is done using byte patches or hooking. However, depending on how the modding API looks like, these might be rendered impossible, as bugfixes at the very least require a hooking API to make sense. If the bugfixes were enabled through a purpose-built API rather than a generic hooking one, that would just raise the question of why not just fix the bugs directly.

Another major issue is the fact that Mega Hack is by far the most popular mod of all time, and also comes with a completely different propietary UI system. Not only that, but Mega Hack has inspired a whole class of mods called Mod Menus (such as GDHM, Mega Mod Menu, Crystal Client, etc.), which are some of the most popular types of mods out there - most people have one.

However, I personally find it unlikely RobTop would want to support mod menus, as they are usually advertised as hack clients, which the official API probably wouldn't want to help. Although, it is definitely impossible to have an API that allows creating mods to any reasonable decree without allowing the creation of hacks.

This does raise the issue mentioned earlier though: **if the official API doesn't support the mods people want, they will use community-made loaders**. This is especially troublesome with bugfix mods - everyone wants them, they are uncontroversial, and yet they require low-level access that flies in the face of safety.

Anyway, with all that said, let's finally get into the meat of this post: examining different API possibilities, starting with the most obvious: scripting.

## 1. A scripting language

| Subject | Score |
| --- | --- |
| Safety | 🟢🟢🟢🟢🟢 |
| Freedom | 🔴⚫⚫⚫⚫ |
| Ease of use | 🟢🟢🟢🟢🟢 |
| Ease of implementation | 🟠🟠⚫⚫⚫ |

This is the most obvious choice for an official modding API. Just add embedded [Lua](https://www.lua.org/) or [Python](https://www.python.org/) support, and you're done. It is very easy to use - anyone with little programming experience can pick up a scripting language, and there are tons upon tons of resources online to help.

This is also easily the most safe option out of all - with a scripting language, you can fully control how much access mods have to the game and the user's device. For instance, file system access could be made to require the user to agree to it first in a popup, or even limited to only allow reading/writing to files the user has selected.

However, the issue with scripting languages is that they are by nature very limited: they have way less freedom than mods made with C++. They can't make arbitary byte patches, they can't make hooks (well, both of these _are possible_ but adding them would completely undermind safety), so they are only limited to whatever functionality the API exposes, which most likely will not cover nearly enough to match all modern mods.

This means that a scripting API would very likely not support bugfix mods **at all**. You simply can't fix a broken code routine if you can't overwrite it in any way. But if you give the scripting language the ability to do that, you lose safety. And if you add specific options to the API for accessing specific routines that people might want to bugfix, _just fix the bugs while you're doing that_. A `fixInvisibleDual()` function makes no sense.

Adding scripting support would also by far be the most time-consuming option in terms of implementation, as there would be tons upon tons of functions that would need to be explicitly given API support all across the game in order to make most mods like BetterEdit possible. In addition, any mod that wants to do something completely novel could die to finding out that the API simply doesn't support it. Maintaining a scripting API would also take a lot of effort - every time you add a new thing or change existing features, you also need to add those changes to the API.

## 2. Official C++ API (without patching)

| Subject | Score |
| --- | --- |
| Safety | 🟠🟠⚫⚫⚫ |
| Freedom | 🟡🟡🟡⚫⚫ |
| Ease of use | 🟡🟡🟡⚫⚫ |
| Ease of implementation | 🟡🟡🟡⚫⚫ |

Another obvious choice would be to compile GD with symbols, release a header with them, and add a built-in way to hook functions, such as by adding a vector that holds a list of hooks to each function. This would make bugfix mods possible - it would allow porting existing mods with likely very little friction, and it would also ensure that mods that need to run performance-critical code can easily do so.

However, this immediately completely kills safety and ease of use. **C++ is not an easy or secure language** - if you load a .DLL on Windows, that DLL can, in the worst case, immediately lock the user's filesystem and require a cryptocurrency ransom to open it. There are ways to mitigate the safety issues as I will discuss in #4, however the ease-of-use point stands - even if the API has the cleanest hooking syntax ever and very wide cross-compiler and platform support, it's still C++ with its 50 years of technical debt.

This would also most likely hurt performance - currently, all hooking methods that mods use have zero runtime overhead if they are not used. In other words, if a function has no hooks, there is absolutely zero performance loss - as should be expected. However, adding built-in hooking using something like a vector would lead to a performance loss (however tiny), especially if implemented poorly, which could result in noticable framedrops on hot functions.

## 3. Official C++ API (with patching)

| Subject | Score |
| --- | --- |
| Safety | 🔴⚫⚫⚫⚫ |
| Freedom | 🟢🟢🟢🟢🟢 |
| Ease of use | 🔴⚫⚫⚫⚫ |
| Ease of implementation | 🟢🟢🟢🟢⚫ |

You could also just rip a page off existing mods' book and just add something akin to [Geode](https://geode-sdk.org) as a built-in mod loader. This would most likely support all existing mods, it would be pretty easy to implement (when you don't have to deal with calling conventions and can just export symbols), and it would also deal a death-blow to safety and ease of use.

And, it would just give rise to a better idea:

## 4. Just release headers and let modders handle it

| Subject | Score |
| --- | --- |
| Safety | _Well, it depends_ |
| Freedom | 🟢🟢🟢🟢🟢 |
| Ease of use | _Well, it depends_ |
| Ease of implementation | 🟢🟢🟢🟢🟢 |

This is by far the easiest solution: just don't add official mod support. After all, we already have [Geode](https://geode-sdk.org), which addresses many of the issues concerning portability and cross-platform modding that an official API would aim to answer. If RobTop released GD's headers, or even just compiled all platforms with symbols, then community-made mod loaders could do the rest with very little friction. Geode also provides another thing an official modding API would bring: an easy way to install mods. RobTop has stated that he would like installing mods to be easier, and well, Geode does that. Just click an in-game list - no need for fiddling with files.

Another thing that Geode could provide in the future is **scripting support**. That's right, if you have infinite freedom, you also have the freedom to add safety and ease of use on top! This would mean that mods which need low-level access can do so, while simpler mods can just use scripting and be guaranteed safe and portable.

Geode also provides a (partial) solution to safety: community vetting of mods. After all, BetterEdit and Mega Hack are already known to be safe, because tens of thousands of people use them and not one has gotten a virus yet. Of course, the user can still manually install untrusted mods, but Geode has the contract that if it's installable in-game, then we have verified it's safe, or if it's not we can remove it from the list.

This strategy also is not without precedent - I mean, **Minecraft** (one of the most actively modded games in history) **does the same**. (Although, someone is going to @ me and mention that Minecraft uses Java which makes it totally different and not applicable)

This would of course not be perfect; unofficial mod loaders can't really do much about iOS, whose platform security makes it really hard to load mods without jailbreaking. Although, given that App Store guidelines disallow loading external code anyway, unofficial mod loaders might actually have a better chance than an official API at getting mods on iOS.

But, if RobTop wants an option that is proven to work and requires the minimum amount of effort concerning upkeep on his part, this would be the one to go for.

## Afterthoughts

I've been thinking of writing this post for like what, two years now? And now I finally did, in a very rambly fashion. So typical of me.

From a modder's perspective, I still think that just letting modders handle mod loading would be the best choice. We already have years of experience dealing with stuff and if RobTop has liked our mods enough to consider adding official mod support, then I think he will like them whether or not they're official.

From RobTop's perspective though, he probably would want to go for a scripting language. After all, that does provide absolute safety - it would be a pretty major scandal if someone managed to get many people to install an officially endorsed mod that turned out to be malware.

Although, we must remember: **if the modding API doesn't support the mods people use, people won't use it**. Of course, this isn't completely true: many people with no access or want for community-made mod loaders will just use whatever they can get from the official one. However, depending on how many mods are missing from the official one, more and more people will still use community-made loaders. Which would be a shame; if the official API isn't better than what the community can do, why bother?

Yeah that's it cya ;)

-HJfod
