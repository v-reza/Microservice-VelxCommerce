import React from 'react'
import FeatureSection from '../../components/FeatureSection/FeatureSection'
import ProductFeatureSection from '../../components/ProductFeatureSection/ProductFeatureSection'
import PromoSection from '../../components/PromoSection/PromoSection'

const Home = () => {
  return (
    <div>
        <PromoSection/>
        <ProductFeatureSection/>
        <FeatureSection/>
    </div>
  )
}

export default Home