import React from 'react';
import { connect } from 'react-redux';
import CompleteRipple from './vis_one/CompleteRipple';
import {
  playPlayback,
  fetchCurrPlayback,
  deviceStateListener,
  zeroPlayBack,
  zeroDeviceStateCounter,
  stopPlayback,
} from '../../../actions';
import { BackBtn, requireAuth } from '../../common';
import history from '../../../history';

class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef();
    this._startingTime = props.progress;
    this._lastTime = null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this._canvas.current.width = window.innerWidth;
    this._canvas.current.height = window.innerHeight;
    this._ctx = this._canvas.current.getContext('2d');
    this._completeCircle = new CompleteRipple(
      this._ctx,
      this._canvas.current.width,
      this._canvas.current.height
    );

    this.animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
    window.removeEventListener('resize', this.handleWindowResize);
    // this.props.zeroPlayBack();
    this.props.zeroDeviceStateCounter();
  }

  handleWindowResize = () => {
    this._canvas.current.width = window.innerWidth;
    this._canvas.current.height = window.innerHeight;
    this._completeCircle._canvasHeight = this._canvas.current.height;
    this._completeCircle._canvasWidth = this._canvas.current.width;
  };

  parseText = text => {
    if (text.length > 28) {
      return `"${text.slice(0, 28)}..."`;
    }
    return `"${text}"`;
  };

  animate = currentTime => {
    if (!this._startingTime) this._startingTime = currentTime;

    const totalElapsedTime = currentTime - this._startingTime;

    this._animationFrame = requestAnimationFrame(this.animate);
    this._ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this._completeCircle.update(
      totalElapsedTime,
      this.props.total_dur,
      this.props.beats,
      this.props.tatums,
      this.props.sections,
      this.props.bars
    );
    if (totalElapsedTime >= this.props.total_dur) {
      window.cancelAnimationFrame(this._animationFrame);
      this.props.stopPlayback();
      history.push('/');
    }
  };

  render() {
    document.title = `${
      this.props.currSongPlayback.item
        ? this.props.currSongPlayback.item.name
        : 'No Song Playing'
    } - ${
      this.props.currSongPlayback.item
        ? this.props.currSongPlayback.item.artists.reduce(
            (final, artist) =>
              `${final}${final === '' ? '' : ', '}${artist.name}`,
            ''
          )
        : ''
    }`;
    return (
      <div
        style={{
          margin: 0,
          background: 'black',
          padding: 0,
          position: 'relative',
        }}
      >
        <canvas style={{ zIndex: 1 }} ref={this._canvas} />
        <BackBtn
          artist={this.props.artist}
          song={this.parseText(this.props.songName)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  let bars = [];
  let beats = [];
  let tatums = [];
  let sections = [];
  let total_dur = 0;
  let isPlayback = false;
  let songName = '';
  let artist = '';

  if (Object.values(state.songAnalysis).length > 0) {
    bars = state.songAnalysis.bars;
    beats = state.songAnalysis.beats;
    tatums = state.songAnalysis.tatums;
    sections = state.songAnalysis.sections;
    total_dur = state.songAnalysis.track.duration * 1000;
  }

  if (Object.values(state.currSongPlayback).length > 0) {
    isPlayback = state.playState.isPlayState;
    artist = state.currSongPlayback.item.artists[0].name;
    songName = state.currSongPlayback.item.name;
  }

  return {
    bars,
    beats,
    tatums,
    sections,
    isPlayback,
    total_dur,
    artist,
    songName,
    deviceCounter: state.deviceCounter.counter,
    currSongPlayback: state.currSongPlayback,
  };
};
export default connect(
  mapStateToProps,
  {
    fetchCurrPlayback,
    playPlayback,
    zeroPlayBack,
    zeroDeviceStateCounter,
    deviceStateListener,
    stopPlayback,
  }
)(requireAuth(Visualizer));
