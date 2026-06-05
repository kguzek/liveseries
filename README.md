# LiveSeries Website

![LiveSeries Tech Stack](https://github-readme-tech-stack.vercel.app/api/cards?title=LiveSeries+Tech+Stack&align=center&lineCount=1&theme=tailwindcss&width=600&bg=%230f172a&badge=%231e293b&border=%231e293b&titleColor=%2338bdf8&line1=typescript%2Ctypescript%2Cauto%3Bnextdotjs%2Cnextjs%2Cauto%3Btailwindcss%2Ctailwind%2Cauto%3Blucide%2Clucide%2Cauto%3Bradixui%2Cradix+ui%2Cauto%3B)

## Intro

This repository contains the source code for [liveseri.es](https://liveseri.es), which is a free-to-use TV show tracking website, featuring automatic episode downloading and a self-hostable media & torrent server.

## History

LiveSeries started out as a personal project back in 2019 in the form of a C console app. In 2020, I restarted the project as LiveSeries 2 in C# using WinForms and the .NET framework. I ended up creating a fully-functional Windows desktop application, which automatically downloaded new releases of TV shows I watched. It had no "client" and "server" side, as it was all one application, just merged together in a single app.

However, after starting my [personal webpage](https://www.guzek.uk), I had the idea of migrating LiveSeries 2 to the web in order to allow cross-client use, and using a centralised server to host and save TV shows and other data. In 2024, I started work on LiveSeries Web, now known as [LiveSeries](https://www.guzek.uk/liveseries), and subsequently renamed LiveSeries 2 (the C# app) to LiveSeries Legacy. The repository is currently [archived but still publicly available](https://github.com/kguzek/LiveSeriesLegacy/) here on GitHub.

However, the limitations of a centralised server quickly became apparent: in order to allow other users to download content, they would need unrestricted access to my own personal server, which was not feasible as the storage space didn't allow it. This is why the episode downloading functionality was temporarily limited to whitelisted accounts while I looked into allowing public access in some form (e.g. a local server download to be able to set up decentralised servers, all while still allowing the web client interface to access it).

In 2025, this idea came true: if you wish to use LiveSeries to its full extent, you can now setup your own [LiveSeries server](https://github.com/kguzek/liveseries-server)! Follow the installation instructions, and enjoy your favourite TV shows for free.

In 2026, I extracted LiveSeries from my personal portfolio website and gave it its own domain, [liveseri.es](https://liveseri.es).

## Backend

The website uses [PayloadCMS](https://payloadcms.com/) for its data storage and user authentication & authorisation. In addition to this, it has a separate, self-hosted LiveSeries server, which **every user can host for themself**. The project is open source and you can find it here on GitHub:

- [https://github.com/kguzek/liveseries-server](https://github.com/kguzek/liveseries-server)
