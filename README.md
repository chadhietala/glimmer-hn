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
install.packages("rjson")
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

### Build the app
```
yarn build
```

### Run the Server

```sh
yarn run serve
```

### Run the Benchmark

```sh
yarn run bench
```

### Generate the Report
```sh
./report.R
```

```
open results/*.png
```

## Creating Synthetic Environments

[Chrome-tracing](https://github.com/krisselden/chrome-tracing) allows us to throttle CPU and Network conditions. This is similiar to what [Lighthouse](https://github.com/GoogleChrome/lighthouse) does to test viability of a mobile web application in a typical real-world environment. By default the benchmark uses the LightHouse CPU and Network Conditions, but you can pass your own environment conditions in `benching/config.json`.

## Collecting Runtime Call Stats

** WARNING:** Turning on V8's runtime call stats adds about 10% overhead in benches. Because of this you should only turn on the call stats to understand how your code is interacting with the underlying runtime e.g. time spent Parse/Compile, JavaScript, IC miss rate etc.

Typically to gather runtime V8 call stats one would have to navigate [chrome://tracing](chrome://tracing) which can be somewhat challenging for mere mortals.