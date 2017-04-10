#!/usr/bin/env Rscript
phases = read.csv('benching/results/phases.csv')
samples = read.csv('benching/results/samples.csv')
gc = read.csv('benching/results/gc.csv')

samples$type = factor(samples$type, levels=c('compile','run','js','gc','duration'))

# by default string factors are ordered alphabetically
phases$phase = factor(phases$phase,
    levels=c('load','render', 'paint'),
    labels=c('Load','Render', 'Paint'))
phases$set = factor(phases$set, levels=c('alpha-with-mods'))
library('ggplot2')

png(file='benching/results/gc.png')
ggplot(aes(y = heap, x = type, color = set), data = gc) +
  geom_boxplot(outlier.size=0.5, outlier.shape=4) +
  scale_y_continuous(labels = function (x) { format(structure(x, class="object_size"),"Mb")})
dev.off()

png(file='benching/results/samples.png', width=1024, height=768)
ggplot(aes(y = ms, x = type, color = set), data = samples) +
  geom_boxplot(outlier.size=0.5, outlier.shape=4)
dev.off()

png(file='benching/results/phases.png', width=1024, height=768)
ggplot(aes(y = ms, x = phase, color = set), data = phases) +
  facet_grid(type ~ ., scales='free_y') +
  geom_boxplot(outlier.size=0.5, outlier.shape=4)
dev.off()