# Vuepress reading time extended plugin

This plugin handles several behaviours to more accurately calculate the reading time (expressed in minutes).

At build time it calculates and store the reading time of each page configured in the plugin options (see [Includes](#includes) and [Excludes](#excludes) options, if none of them are provided it processes all available pages).

It calculates the base reading time by counting the words on the page and applying a [multiplier](#words-per-minute) to it and it improves the accuracy by handling [images](#image-time), [code blocks](#code-time-per-line), [custom components](#custom-components) and overridden values for [pages](#frontmatter) and [single components](#explicit-time-for-single-components) 


## Options

``` js
    {
        includes: ['docs/.*'],
        excludes: ['other-docs/.*'],
        wordsPerMinute: 200,
        imageTime: 2,
        codeTimePerLine: 1,
        customComponents: [
          {
            name: 'CustomComponent',
            time: 5
          }
        ],
    }
```


### Includes

If set restrict the pages to be processed otherwise the plugin processes all the available pages.

Optional field.


### Excludes

Excludes single or multiple pages

Optional field.

Note: works if `includes` field is not set.


### Words per minute

Defines the number of words that can be read in a minute by a user.

Optional field, default value `200`.


### Image time

Defines the time that a user can spend on an image

Optional field, default value `1`.


### Code time per line

Defines the time that a user can spend on each line of code in a code block

Optional field, default value `2`.


### Custom components

Helps to handle the reading time for custom components.
Each object inside the array should be formatted as follow:
- **name**: The name of the component case sensitive (e.g. `CustomComponent` for `<CustomComponent></CustomComponent>`)
- **time**: the time to be applied for each occurrences founded in the page

Optional field, default value `[]`.

## Override

The plugin handles a manual configuration of the reading time for a page or a part of it.

It can work with:

### Frontmatter

Configure reading time for an entire page directly on its frontmatter:

``` yaml
---
readingTime:
  text: 24 min read
  minutes: 24
  words: 127
---
```

### Explicit time for single components

Set a specific reading time for a single component. This will be added to the base reading time of the page.

``` html
<div readingTime="12">
    ...
</div>
```

## Usage

After have installed and registered the plugin use the generated object in a component as follow:

``` js
console.log(this.$page.readingTime)
// { text: '24 min read', minutes: 24, words: 127 }
```
