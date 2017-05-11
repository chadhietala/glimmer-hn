#!/usr/bin/env Rscript
date = Sys.Date();
folder = paste('./benching/results-', date, '/', sep = '')
phases = read.csv(paste(folder, 'phases.csv', sep = ''))
samples = read.csv(paste(folder, 'samples.csv', sep = ''))
gc = read.csv(paste(folder, 'gc.csv', sep = ''))
library('rjson')

config = fromJSON(file='./benching/config.json')
testNames = lapply(config$servers, function(item) return(c(item$name)))

control = phases[phases$set == testNames[1] & phases$phase == 'render' & phases$type == 'cumulative',]$ms
experiment = phases[phases$set == testNames[2] & phases$phase == 'render' & phases$type == 'cumulative',]$ms
result = wilcox.test(experiment, control, conf.int=TRUE)

samples$type = factor(samples$type, levels=c('compile','run','js','gc','duration'))

# by default string factors are ordered alphabetically
phases$phase = factor(phases$phase,
    levels=c('load','render', 'paint'),
    labels=c('Load','Render', 'Paint'))
phases$set = factor(phases$set, levels=testNames)
library('ggplot2')

png(file=paste(folder, 'gc.png', sep = ''))
ggplot(aes(y = heap, x = type, color = set), data = gc) +
  geom_boxplot(outlier.size=0.5, outlier.shape=4) +
  scale_y_continuous(labels = function (x) { format(structure(x, class="object_size"),"Mb")})
dev.off()

png(file=paste(folder, 'samples.png', sep = ''), width=1024, height=768)
ggplot(aes(y = ms, x = type, color = set), data = samples) +
  geom_boxplot(outlier.size=0.5, outlier.shape=4)
dev.off()

png(file=paste(folder, 'phases.png', sep = ''), width=1024, height=768)
ggplot(aes(y = ms, x = phase, color = set), data = phases) +
  facet_grid(type ~ ., scales='free_y') +
  geom_boxplot(outlier.size=0.5, outlier.shape=4) +
  labs(title = paste0(testNames[2]," against control ", testNames[1]), color = "Set",
   x = paste0("estimated shift is ", result$estimate, ", confidence interval from ", result$conf.int[1], " to ", result$conf.int[2], " for ", attr(result$conf.int, "conf.level"),", p.value: ", result$p.value))
dev.off()
