# Sugar Factory

Sugar Factory is a service that allows dev teams to easily build, test, deploy and share prompts over an API. It provides a frontend UI for managing prompts and underlying LLMs.

## Dev Setup

    - Clone the repo
    - `cp .nvmrc.example .nvmrc` and add the latest `V18` in `.nvmrc` ex: `v18.16.0`
    - Run `npm install` to install dependencies
    - Run `npm run prepare` to setup git
    - `cp .env.example .env` and populate environment variables in `.env`
    - Setup db `npx prisma db push`
    - Run `npm run dev` to start service

## References

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

## Deploy

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
