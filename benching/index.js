const ChromeTracing = require('chrome-tracing');
const Runner = ChromeTracing.Runner;
const InitialRenderBenchmark = ChromeTracing.InitialRenderBenchmark;
const fs = require('fs');
const mkdirp = require('mkdirp').sync;
let browserOpts = {
  type: "canary"
};

const config = JSON.parse(fs.readFileSync("./benching/config.json", "utf8"));

const LIGHTHOUSE_NETWORK_CONDTIONS = {
  latency: 150, // 150ms
  downloadThroughput: Math.floor(1.6 * 1024 * 1024 / 8), // 1.6Mbps
  uploadThroughput: Math.floor(750 * 1024 / 8), // 750Kbps
  offline: false
};

const LIGHTHOUSE_CPU_THROTTLE = 4.5;

let benchmarks = config.servers.map(({ name, port }) => new InitialRenderBenchmark({
  name,
  url: `http://localhost:${port}/?perf.tracing`,
  markers: [
    { start: "domLoading", label: "load" },
    { start: "beforeRender", label: "render" }
  ],
  cpuThrottleRate: config.cpu || LIGHTHOUSE_CPU_THROTTLE,
  runtimeStats: config.runtimeStats || false,
  networkConditions: config.network || LIGHTHOUSE_NETWORK_CONDTIONS,
  browser: browserOpts
}));

let runner = new Runner(benchmarks);

runner.run(50).then((results) => {
  let samplesCSV = "set,ms,type\n";
  let gcCSV = "set,heap,type\n";
  results.forEach(result => {
    let set = result.set;
    result.samples.forEach(sample => {
      samplesCSV += set + "," + (sample.compile / 1000) + ",compile\n";
      samplesCSV += set + "," + (sample.run / 1000) + ",run\n";
      samplesCSV += set + "," + (sample.js / 1000) + ",js\n";
      samplesCSV += set + "," + (sample.gc / 1000) + ",gc\n";
      samplesCSV += set + "," + (sample.callFunction / 1000) + ",callFunction\n"
      samplesCSV += set + ',' + (sample.parseOnBackground / 1000) + ',parseOnBackground\n'
      samplesCSV += set + "," + (sample.duration / 1000) + ",duration\n";
      sample.gcSamples.forEach(sample => {
        gcCSV += set + "," + sample.usedHeapSizeBefore + ",before\n";
        gcCSV += set + "," + sample.usedHeapSizeAfter + ",after\n";
      });
    });
  });
  let phasesCSV = "set,phase,ms,type\n";
  results.forEach(result => {
    let set = result.set;
    result.samples.forEach(sample => {
      sample.phaseSamples.forEach(phaseSample => {
        phasesCSV += set + "," + phaseSample.phase + "," + (phaseSample.self / 1000) + ",self\n";
        phasesCSV += set + "," + phaseSample.phase + "," + (phaseSample.cumulative / 1000) + ",cumulative\n";
      });
    });
  });
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if(dd < 10){
    dd = `0${dd}`;
  }
  if(mm < 10){
    mm =`0${mm}`;
  }

  let folder = `./benching/results-${yyyy}-${mm}-${dd}`;

  mkdirp(folder);
  fs.writeFileSync(`${folder}/samples.csv`, samplesCSV);
  fs.writeFileSync(`${folder}/gc.csv`, gcCSV);
  fs.writeFileSync(`${folder}/phases.csv`, phasesCSV);
  fs.writeFileSync(`${folder}/results.json`, JSON.stringify(results, null, 2));
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
