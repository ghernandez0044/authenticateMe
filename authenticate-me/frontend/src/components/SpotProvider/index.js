// Necessary imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loadSpot } from '../../store/oneSpot'
import CreateASpot from '../CreateASpot'

function SpotProvider(){
    // Create dispatch method
    const dispatch = useDispatch()

    // Deconstruct id from parameters object
    const { id } = useParams()

    // Load details of the spot found by the id 
    useEffect(() => {
        dispatch(loadSpot(id))
    }, [])

    const spot = useSelector(state => state.singleSpot.singleSpot)

    if(!spot) return <h2>No Spot Found</h2>

    return (
            <CreateASpot edit={true} spot={spot} />
    )
}

export default SpotProvider