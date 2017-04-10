# glimmer-hn

This is a WIP clone of the Hackernews demoware app.

# Running The Benchmarks

We use [Chrome Tracing](https://github.com/krisselden/chrome-tracing) and [HARRemix](https://github.com/krisselden/har-remix) to create an isolated and reproducable environment for performance measurements. To run the benchmarks do the following:

## Setup
### Prerequisites

These instructions assume Mac and using homebrew.

Install R
```sh
brew tap homebrew/science
brew install r
```

Run R
```sh
R
```

Then install ggplot2
```R
install.packages("ggplot2")
q()
```

Install yarn
```sh
brew install yarn
```

### Install

```sh
git clone git@github.com:chadhietala/glimmer-hn.git
cd glimmer-hn
yarn
```

### Run the Server

```sh
yarn run serve
```

### Run the Benchmark

```sh
yarn run bench
```

# TODO Need to write the R script... currently a copy pasta job

### Generate the Report
```sh
./report.R
```

```
open results/*.png
```