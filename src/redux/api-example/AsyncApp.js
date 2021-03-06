import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit, postLoad } from './actions';
import Picker from './Picker';
import Posts from './Posts';
class AsyncApp extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log('componentDidMount');
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(postLoad(this.props.selectedSubreddit));
    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate');
        if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
            const { dispatch, selectedSubreddit } = this.props;
            dispatch(postLoad(selectedSubreddit));
        }
    }

    dropDownChangge = (nextSubreddit) => {
        console.log('dropDownChangge');
        this.props.dispatch(selectSubreddit(nextSubreddit));
        this.props.dispatch(postLoad(nextSubreddit));
    }

    handleRefreshClick = (e) => {
        console.log('handleRefreshClick');
        e.preventDefault()
        // const { dispatch, selectedSubreddit } = this.props;
        // dispatch(invalidateSubreddit(selectedSubreddit))
        // dispatch(postLoad(selectedSubreddit)) 
        // can replace by followed :
        this.props.dispatch(invalidateSubreddit(this.props.selectedSubreddit));
        this.props.dispatch(postLoad(this.props.selectedSubreddit));
    }

    render() {
        const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
        return (
            <div>
                <Picker
                    value={selectedSubreddit}
                    onChange={this.dropDownChangge}
                    options={['javascript', 'reactjs', 'frontend', 'angularjs', 'rubyonrails', 'php']}
                />
                <p>
                    {lastUpdated &&
                        <span>
                            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
                        </span>}
                    {!isFetching &&
                        <a href="#" onClick={this.handleRefreshClick}>
                            Refresh
            </a>}
                </p>
                {isFetching && posts.length === 0 && <h2>Loading...</h2>}
                {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
                {posts.length > 0 &&
                    <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                        <Posts posts={posts} />
                    </div>}
            </div>
        )
    }
}

AsyncApp.propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { selectedSubreddit, postsBySubreddit } = state;
    const {
        isFetching,
        lastUpdated,
        items: posts
    } = postsBySubreddit[selectedSubreddit] || {
        isFetching: true,
      items: []
    }

    return {
        selectedSubreddit,
        posts,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp)