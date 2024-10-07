import PropTypes from 'prop-types';

const GifGallery = ({ gifs }) => {
    return <div id="content">
        {
            gifs.map(gif => (
                <div className='result' key={gif.id}>
                    <img src={`${gif.images.fixed_width_downsampled.url}`} alt="" title={`${gif.title}`} />
                    <span><a target='_blank' rel='noreferrer' href={`${gif.url}`}>View on Giphy!</a></span>
                    <p>Rating: {`${gif.rating.toUpperCase()}`}</p>
                </div>))
        }
    </div>;
};

GifGallery.propTypes = {
    gifs: PropTypes.array.isRequired,
};

export default GifGallery;