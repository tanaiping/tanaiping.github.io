/**
 *安装命令：
 * 全局安装 npm install webpack webpack-cli –g   （不推荐）  
 * 本地安装：npm install webpack webpack-cli --save-dev （推荐）
 * 开发环境配置 让代码运行
 * 运行项目指令：
	webpack:会将打包结果输出；
	npx webpack-dev-server 只会在内存中编译打包，没有输出
 */

const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成一个html文件 
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //js中提取css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')//压缩css插件

module.exports = {
	//单入口
	// entry:'./src/js/index.js',
	//多入口
	entry:{
		main:'./src/js/index.js',
		com:'./src/js/public.js',
	}
	output:{
		//[name]:取文件名
		filename:'js/[name][contenthash:10].js',
		path:resolve(__dirname,'build')
	},
	module:{
		rules:[
			//处理less资源 
			{
				oneof:[
					{
						test:/\.less$/,
						use:['style-loader','css-loader','less-loader']//执行顺序是自下往上
					},
					//处理css资源 
					{
						test:/\.css$/,
						use:[
							// 'style-loader',//创建style标签 把样式放入
							MiniCssExtractPlugin.loader,//取代style-loader 提取js中的css文件  生成单独的css文件
							'css-loader',
							]
					},
					//处理图片资源 
					{
						test:/\.(jpg|png|gif)/,
						loader:['url-loader'],
						options:{
							limit:8*1024,
							name:[hash:10].[ext],
							esModule:false,
							outputpath:'imgs'
						}
					},
					//处理html中的图片资源
					{
						test:/\.html$/,
						loader:['html-loader'],
					},
					//处理其他资源
					{
						exclude:/\.(html|css|less|jpg|png|gif|js)/,
						loader:['file-loader'],
						options:{
							name:[hash:10].[ext],
							outputpath:'media'
						}
					}
				]
			}
			
		]
	},
	plugins:[//插件集
		new HtmlWebpackPlugin({ //此插件生成一个html
			template:'./src/index.html',
			minify:{
				collapseWhitespace:true,//移除空格
				removeComments:true//移除注释
			}
		}),
		new MiniCssExtractPlugin({//
			filename:'css/built[contenthash:10].css'
		}),
		new OptimizeCssAssetsWebpackPlugin()//压缩css
		
	],
	optimization:{
		splitChunks:{
			chunks:'all'
		}
	},
	mode:'development', //生产环境：production  生产环境下会自动压缩js代码 
	devServer:{
		contentBase:resolve(__dirname,'build'),
		compress:true,//压缩
		port:3000,
		open:true,
		hot:true//热处理
	},
	devtool:'source-map'
	
}