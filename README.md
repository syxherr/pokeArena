# Pokemon Arena ⚔️
I challenge you, if you dare, come with your strongest Pokemon and let us battle. Pick any Pokémon, throw them in the arena, and let the Pokémon decide who's the winner.
 
## What You Can Do
- 🔍 **Search Pokémon** — type a name, results pop up instantly
- 🎲 **Feeling lucky?** — hit random and two Pokémon get picked for you
- ⚔️ **Die For You** — throw two Pokémon in the arena and see who's the winner.
- 📊 **Stat reveal** — stats drop to keep the tension going
- 🏆 **The Winner Takes It All** — most stat wins = the champion
- 📜 **Battle history** — every match gets saved, check it anytime

  
## Tech Stack
- **React + TypeScript + Vite** — frontend framework with static typing, bundled with Vite for fast dev experience
- **Redux Toolkit + redux-persist** — global state management for battle history, auto-persisted to localStorage
- **SWR** — data fetching with built-in caching, deduplication, and loading/error state
- **motion/react** — stat reveal and overlay transition animations
- **CSS Modules + Styled Components** — scoped styling per component, zero class conflicts
- **PokeAPI** — REST API as Pokémon data source, list cached to localStorage to avoid re-fetching every session

## Try it here 🚀
 [Pokemon Arena](https://syxherr.github.io/pokeArena/)
