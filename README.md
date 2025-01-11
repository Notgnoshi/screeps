# screeps
Embarassing screeps code; probably don't look at this

## Vim ALE LSP configuration

```sh
npm install -g typescript-language-server typescript
npm install @types/screeps
npm install @types/lodash
```

## TODO list

* [X] Add `Role` class heirarchy, to enable code-sharing between roles, which in turn enables
      fallback `Role`s.
* [ ] IDE integration
  * [X] tsserver
  * [X] prettier
  * [ ] eslint
* [ ] Add `Tower` behavior for repair and defense
* [ ] `.energy` and `.energyCapacity` are deprecated in favor of `.store`
* [ ] Make creep components dependent on energy availability (maybe max energy availability?)
* [ ] Move creep spawning logic into `Role`s?
* [ ] Add up to 5 `WORK` components to `MinerRole`s based on energy availability
* [ ] Long-distance harvesting
* [ ] Expand to other rooms
