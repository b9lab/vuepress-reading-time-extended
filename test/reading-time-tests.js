const chai = require("chai");
const { expect } = chai;
const ReadingTime = require("../src/reading-time");
const config = {
    wordsPerMinute: 200,
    imageTime: 2,
    codeTimePerLine: 1,
    customComponents: [
        {
            name: 'TestComponent',
            time: 3
        }
    ]
}
const readingTime = new ReadingTime(config);


describe('Reading time tests', () => {

    describe('Plain texts', () => {
    
        it('should calc time for plain text', async () => {
            var content = "One two three";
            var expectedMinutes = 3 / config.wordsPerMinute;
            expect(readingTime.getTime(content).minutes).to.be.equal(expectedMinutes);
        });

        it('shouldn\'t calc time for empty text', async () => {
            var content = "";
            expect(readingTime.getTime(content).minutes).to.be.equal(0);
        });

        it('shouldn\'t add time for text in multiple lines', async () => {
            var content = "One \n\
             two \n\
             three";
            var expectedMinutes = 3 / config.wordsPerMinute;
            expect(readingTime.getTime(content).minutes).to.be.equal(expectedMinutes);
        });

    });

    describe('Code blocks', () => {
    
        it('should calc single line code block time', async () => {
            var content = "```javascript \n\
                var foo = 3 + 7; \n\
            ```";
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(config.codeTimePerLine);
        });

        it('should calc multiple lines code block time', async function() {
            var content = "```javascript \n\
                var foo = 3; \n\
                var bar = 7; \n\
                var foobar = foo + bar; \n\
            ```";
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(config.codeTimePerLine * 3);
        });

        it('should calc multiple code block time', async () => {
            var content = "```javascript \n\
                var foo = 3; \n\
                var bar = 7; \n\
                var foobar = foo + bar; \n\
            ``` \n\
            ``` \n\
                var foo = 3; \n\
                var bar = 7; \n\
                var foobar = foo + bar; \n\
            ```";
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(config.codeTimePerLine * 3 * 2);
        });

    });

    describe('Images', () => {
    
        it('should find and calc time for an image', async () => {
            var content = "![Alt](images/test.png)";
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(config.imageTime);
        });

        it('should find and calc time for multiple images', async function() {
            var content = "![Alt1](images/test1.png) \n\
                ![Alt2](images/test2.png) \n\
                ![Alt3](images/test3.png)";
            expect(readingTime.getTime(content).minutes).to.be.equal(config.imageTime * 3);
        });

    });

    describe('Custom components', () => {
    
        it('should find and calc time for a custom component', async () => {
            var name = config.customComponents[0].name;
            var time = config.customComponents[0].time;
            var content = `<${name}/>`;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(time);
        });

        it('should find and calc time for multiple custom components', async () => {
            var name = config.customComponents[0].name;
            var time = config.customComponents[0].time;
            var content = `<${name}/>
                <${name}></${name}>
                <${name}> foo </${name}> `;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(time * 3);
        });

        it('should not add time for closing custom component tag', async () => {
            var name = config.customComponents[0].name;
            var content = `</${name}>`;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(0);
        });

    });

    describe('Explicit reading time', () => {
    
        it('should find and add explicit time for a custom component', async () => {
            var time = 5;
            var content = `<MyComponent prop1="test" readingTime="${time}"/>`;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(time);
        });

        it('should not add explicit time with different prop name', async () => {
            var time = 5;
            var content = `<MyComponent prop1="test" readingTimes="${time}"/>`;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(0);
        });

        it('should add only the first explicit time found', async () => {
            var time = 5;
            var content = `<MyComponent prop1="test" readingTime="${time}" readingTime="${20}"/>`;
            expect(parseInt(readingTime.getTime(content).minutes)).to.be.equal(time);
        });

    });
    
});