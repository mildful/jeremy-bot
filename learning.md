# How are we gonna learn ?

This document describe the learning process. It consists of neural networks and genetic algorithm.

## How does it works

We have a **lot** of inputs : `gridCels + 4` (so with current settings something like ~15k).
- the grid. mapping : {
                    -1 => 0,
                    0 => 0.3,
                    1 => 0.6,
                    2 => 1
                }
- life. mapping : { 0 => 0, 250 => 1 }
- enemiesCount. mapping : { 0 => 0, 30 => 1 } (30 seems to be a viable max range)
- movement
    - < .45  : move left key is pressed
    - > .55  : move right key is pressed
    - default: no movement keys pressed
- jump
    - > .5   : jump key is pressed
    - default: jump key is not pressed

We also have 3 outputs :
- movement
    - < .45  : press left
    - > .55  : press right
    - default: stay here
- jump
    - > .5   : press space
    - default: stay
- punch
    - > .5   : press punch
    - default: stay

## Genetic Algorithm

Each Generation consists of 10 neural networks (Genomes).

Each genome is tested with the game, by constantly mapping the read inputs from the game to the inputs of the neural network, and by getting the output/activation from the network and applying to the keys of the keyboard.

While testing each genome, we keep track of it's "fitness" by watching the score.

When an entire generation is completed, we remove the worst genomes until achieving N genomes. With those N genomes, we then select two randomly, and cross-over their values/configurations. After that, we apply random mutations in the values/configurations of the Neural Network, creating a new genome.

We do the cross-over/mutation until we get 10 genomes again, and repeat it constantly.
