// Necessary imports
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getReviews } from '../../store/reviews'
import ReviewGalleryCard from '../ReviewGalleryCard'
import OpenModalButton from '../OpenModalButton'
import CreateReview from '../CreateReview'
import './ReviewGallery.css'

function ReviewGallery({ id, reviewCount, avgRating, renderObj }){
    // Create dispatch method
    const dispatch = useDispatch()

    // Load reviews into state on component render
    useEffect(() => {
        console.log('dispatch')
        dispatch(getReviews(id))
    }, [])

    // Create a reference to the reviews state slice
    const data = useSelector(state => state.reviews?.Reviews?.Reviews)

    const reRenderReviews = () => {
        console.log('rerender')
        dispatch(getReviews(id))
    }

    let reviews
    if(data){
        reviews = data.filter(review => review.spotId === +id)
    }

    if(!reviews || reviews.length === 0) return (
        <>
            <div className='stars-container'>
                <div className='rating'>
                    <div className='new-star'>
                        <i className='fa-solid fa-star' />
                        <h2>New</h2>
                    </div>
                    <OpenModalButton modalComponent={<CreateReview id={id} renderObj={renderObj} />} buttonText='Post Your Review' onModalClose={reRenderReviews} />
                </div>
            </div>
        </>
    )


    return (
        <div>
            <div className='reviews-header-container'>
                <div className='stars-container'>
                    <div className='rating row'>
                        <i className='fa-solid fa-star' />
                        {reviews && reviewCount > 0 ? ( <p>{avgRating}</p> ) : ( <p>New</p> )}
                    </div>
                    {reviews && reviewCount > 0 && (  <><div className='dot'>
                        {reviews && ( <span>&#183;</span> )}
                    </div>
                    <div className='reviews'>
                        {reviews && ( <p>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p> )}
                    </div></> )}
                </div>
            </div>
            <OpenModalButton modalComponent={<CreateReview id={id} renderObj={renderObj} />} buttonText='Post Your Review' onModalClose={reRenderReviews} />
            <ul className='reviews-list'>
                {reviews.map(review => (
                    <ReviewGalleryCard key={review.id} data=
                    {review} />
                ))}
            </ul>
        </div>
    )
}

export default ReviewGallery