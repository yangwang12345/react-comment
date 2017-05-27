import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import $ from 'jquery';
import './index.css';
var url="./data.json";
class CommentBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
		this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
	}
	loadCommentsFromServer () {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({
					data: data
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
	handleCommentSubmit(comment) {
		var comments = this.state.data;
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({
			data: newComments
		});
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({
					data: data
				});
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({
					data: comments
				});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
	componentDidMount () {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	}
	render () {
		return (
		  <div className="commentBox">
		    <h1>Comments</h1>
		    <CommentList data={this.state.data} />
		    <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
		  </div>
		);
	}
};

ReactDOM.render(
  <CommentBox url={url} pollInterval={2000}/>,
  document.getElementById('root')
);
