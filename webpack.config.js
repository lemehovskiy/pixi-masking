module.exports = {
    watch: true,
    entry: './src/pixi-masking.es6',
    output: {
        filename: 'build/pixi-masking.js',
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};