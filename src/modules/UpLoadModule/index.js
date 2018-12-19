import React, { Component } from 'react'
import stringHash from "string-hash";
import { withCookies, Cookies } from 'react-cookie';
import './index.css'
const axios = require('axios');


class View extends Component {
	constructor(props) {
		super(props);
		const { cookies } = props;
		this.state = {
			fileName: null,
			fileSize: null,
			fileNameStoreAsGithub: null,
			repo: cookies.get('repo') || '',
			token: cookies.get('token') || '',
			hasToken: cookies.get('token') ? true : false,
			apiRes: {},
			showFailMsg: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.fileInput = React.createRef();
		this.handleImageChange = this.handleImageChange.bind(this);
		this.commitToGithub = this.commitToGithub.bind(this);
		this.tokenInputOnchange = this.tokenInputOnchange.bind(this);
		this.deleteToken = this.deleteToken.bind(this);
		this.comfirmToken = this.comfirmToken.bind(this);
		this.repoInputOnchange = this.repoInputOnchange.bind(this);
	}

	comfirmToken(e) {
		e.preventDefault();
		let { token } = this.state
		if (token !== '') {
			const { cookies } = this.props;
			//
			function addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
			}
			var date = new Date();
			date = addDays(date, 10000)

			cookies.set('token', token, {
				path: '/',
				expires: date
			});

			this.setState({
				hasToken: true
			})
		}
	}

	deleteToken(e) {
		e.preventDefault();
		const { cookies } = this.props;
		this.setState({
			token: ''
		})
		cookies.remove('token')
		this.setState({
			hasToken: false
		})
	}

	repoInputOnchange(e) {
		console.log(e.target.value)
		this.setState({
			repo: e.target.value
		})

		//
		function addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		}
		var date = new Date();
		date = addDays(date, 10000)

		const { cookies } = this.props
		cookies.set('repo', e.target.value, {
			path: '/',
			expires: date
		});
	}

	tokenInputOnchange(e) {
		console.log(e.target.value)
		this.setState({
			token: e.target.value
		})
	}

	handleSubmit(e) {
		e.preventDefault();
		// console.log(this.fileInput.current.files[0])
		let reader = new FileReader();
		let file = this.fileInput.current.files[0];
		let fileName = String(this.fileInput.current.files[0].name);
		let nowTime = new Date().getTime();
		let fileType = fileName.substring(fileName.lastIndexOf('.'));
		let fileNameStoreAsGithub = stringHash(String(nowTime) + String(fileName)) + fileType;

		//
		reader.onloadend = () => {
			console.log(reader.result)
			let base64File = reader.result
			base64File = base64File.substring(base64File.indexOf(',') + 1) //remove no use string fragment
			console.log(base64File)
			this.commitToGithub(base64File, fileNameStoreAsGithub)
				.then(() => {
					this.setState({
						fileNameStoreAsGithub
					})
				})
		}

		//
		reader.readAsDataURL(file);

	}

	commitToGithub(fileEncodeWithBase64, fileName) {
		let file = String(fileEncodeWithBase64);
		let { token, repo } = this.state
		let self = this;
		console.log(file)
		return axios(
			{
				method: 'PUT',
				url: 'https://api.github.com/repos/p208p2002/' + repo + '/contents/drive/' + fileName,
				headers: {
					Authorization: 'token ' + token
				},
				data: {
					"message": "my commit message",
					"committer": {
						"name": "Scott Chacon",
						"email": "schacon@gmail.com"
					},
					"content": file
				}
			}
		)
			.then(function (response) {
				console.log(response.data.content)
				self.setState({
					apiRes: response.data.content
				})
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				self.setState({
					showFailMsg: true
				})
			})
	}

	handleImageChange(e) {
		e.preventDefault();
		console.log(this.fileInput.current.files[0])
		let { name = null, size = null } = this.fileInput.current.files[0]
		this.setState({
			fileName: name,
			fileSize: size
		})
	}

	render() {
		let { fileSize, fileName,
			fileNameStoreAsGithub, token, hasToken,
			apiRes, showFailMsg, repo
		} = this.state;
		let { download_url = '', html_url = '', git_url = '' } = apiRes
		console.log(download_url)
		return (
			<div id="Upload">
				<form onSubmit={this.handleSubmit}>
					<label>
						Token:
						{hasToken ?
							<span><b>{token.substring(0, 5) + '***...'}</b></span>
							:
							<input
								type="text"
								onChange={e => this.tokenInputOnchange(e)}
								value={token}
							/>
						}
					</label>
					{hasToken ?
						<button
							type="button"
							className="btn-danger btn-sm token-btn"
							onClick={e => this.deleteToken(e)}
						>
							delete token
						</button>
						:
						<button
							type="button"
							className="btn-success btn-sm"
							onClick={e => this.comfirmToken(e)}
						>
							confirm token
						</button>
					}
					<br />
					<label>
						Target Repo:
						<input type="text" value={repo} onChange={this.repoInputOnchange} />
					</label>
					<br />
					<label>
						Upload file:
            <input
							type="file"
							ref={this.fileInput}
							onChange={e => this.handleImageChange(e)}
						/>
					</label>
					<br />
					<button
						type="submit"
						disabled={fileName !== null && hasToken === true && repo !== '' ? false : true}
					>
						Submit
					</button>
					<br />
					{showFailMsg ? <small className='text-danger'>upload fail,check token of file</small> : null}

				</form>
				File name:{fileName}
				<br />
				File size:{fileSize / 1024}KB
				<br />
				{fileNameStoreAsGithub}
				<hr />
				<label>
					Download URL(direct link):
					<br />
					<input type="text" value={download_url} />
				</label>
				<br />
				<label>
					GIT URL:
					<br />
					<input type="text" value={git_url} />
				</label>
				<br />
				<label>
					HTML URL:
					<br />
					<input type="text" value={html_url} />
				</label>
				{/* https://raw.githubusercontent.com/p208p2002/git_practice/master/346419349.py */}
			</div>
		);
	}
}

export default withCookies(View);