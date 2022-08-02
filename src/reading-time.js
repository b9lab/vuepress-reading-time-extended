class ReadingTime {
    constructor(config) {
        this._setup(config);
    }

    getTime(pageContent) {
        const content = this._clearContent(pageContent);

        const words = this._getWordsCount(content); 

        var additionalMinutes = 0;

        additionalMinutes += this._handleExplicitReadingTime(content);
        additionalMinutes += this._handleCustomComponents(content);
        additionalMinutes += this._handleCodeBlocks(content);
        additionalMinutes += this._handleImages(content);

        return this._formatReadingTime(words, additionalMinutes);
    }

    _handleExplicitReadingTime(content) {
        var additionalMinutes = 0;
        const match = /readingTime="(.*?)"/g.exec(content); // check for property readingTime="n"

        if (match && match.length > 1) {
            var additionalReadingTime = parseInt(match[1]);
            if (!isNaN(additionalReadingTime)) additionalMinutes = additionalReadingTime;
        }

        return additionalMinutes;
    }

    _handleCustomComponents(content) {
        var additionalMinutes = 0;

        for (var item of this.config.customComponents) {
            const regex = new RegExp(`<${item.name}( |\/|>)`, 'g');
            const match = content.match(regex);
            if (match) additionalMinutes += item.time * match.length;
        }

        return additionalMinutes;
    }

    _handleCodeBlocks(content) {
        var additionalMinutes = 0;

        const matches = [...content.matchAll(/```[\s\S]*?```/g)];

        if (matches && matches.length > 0) {
            for (var match of matches) {
                const item = match[0];
                const linesCount = this._getLinesCount(item);
                additionalMinutes += linesCount * this.config.codeTimePerLine;

                // removing default word per minute count for code block
                additionalMinutes -= this._calcMinutes(this._getWordsCount(item));
            }
        }

        return additionalMinutes;
    }

    _handleImages(content) {
        var additionalMinutes = 0;

        const matches = [...content.matchAll(/!\[.*?\]\(.*?\)/g)];

        if (matches && matches.length > 0) {
            for (var item of matches) {
                additionalMinutes += this.config.imageTime;
                additionalMinutes -= this._calcMinutes(this._getWordsCount(item[0]));
            }
        }

        return additionalMinutes;
    }

    _getLinesCount(content) {
        return content.split("\n").filter(item => item && item != "" && !item.includes("```")).length;
    }

    _getWordsCount(content) {
        return (
            content
            .replace(/[\u4E00-\u9FA5]/g, "")
            .match(
                /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g
            ) || []
        ).length;
    }

    _calcMinutes(wordsCount) {
        return wordsCount / this.config.wordsPerMinute;
    }

    _clearContent(text) {
        // ignores commented code
        return text.replace(/<!--[\s\S]*?-->/g, "");
    }

    _formatReadingTime(words, additionalMinutes) {
        var minutes = this._calcMinutes(words) + additionalMinutes;
        var displayed = Math.ceil(minutes.toFixed(2));
    
        return {
            text: displayed + ' min read',
            minutes: minutes,
            words: words
        }
    }

    _setup(config) {
        this.config = config;

        // applying default values if needed
        if (!this.config.wordsPerMinute) this.config.wordsPerMinute = 200;
        if (!this.config.codeTimePerLine) this.config.codeTimePerLine = 2;
        if (!this.config.imageTime) this.config.imageTime = 2;
        if (!this.config.customComponents) this.config.customComponents = [];
    }
}

module.exports = ReadingTime;
