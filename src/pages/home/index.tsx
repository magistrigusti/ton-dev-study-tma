/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import { FC, useEffect, useState } from 'react'
import WebAppSDK from '@twa-dev/sdk'
import { motion } from 'framer-motion'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useDebounce } from 'usehooks-ts'
import { Address } from '@ton/ton'
import s from './home.module.scss'
import { Amount } from '../../components/amount'
import { SvgSelector } from '../../components/svgSelector'
import { AssetType } from '../../types/assetType'
import { getHubClient } from '../../utils/getClient'
import { SelectAsset } from '../../components/selectAsset'
const initialSwapToken1: AssetType = {
    token: 'TON',
    decimals: 9,
    tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png',
    tokenAddress: [ '0:9a8da514d575d20234c3fb1395ee9138f5f1ad838abc905dc42c2389b46bd015', '0:436b4ff60f7bacf75f70d422cfb6b5ae7cd2846f0f3553ae8bcc798258923608' ]
}

const initialSwapToken2: AssetType = {
    token: 'DFC',
    decimals: 9,
    tokenLogo: 'https://assets.dedust.io/images/dfc.webp',
    tokenAddress: [ '0:f6eb371de82aa9cfb5b22ca547f31fdc0fa0fbb41ae89ba84a73272ff0bf2157', '0:c288b9102a934e1a93435f6a194470da340559a95e9c9816c682ccff2215149d' ]
}

interface HomeProps {}

export const Home: FC<HomeProps> = () => {
    const [ tonConnectUI ] = useTonConnectUI()
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ isValidAmount, setIsValidAmount ] = useState<boolean>(true)
    const [ swapped, setSwapped ] = useState(false)
    const [ isFromAssets, setIsFromAssets ] = useState(true)
    const [ estimateLoading, setEstimateLoading ] = useState(true)
    const [ swapLoading, setSwapLoading ] = useState(false)

    // assets
    const [ assetsLoading, setAssetsLoading ] = useState(false)
    const [ dedustAssets, setDedustAssets ] = useState<AssetType[] | undefined>(undefined)

    const [ token1, setToken1 ] = useState<AssetType>(initialSwapToken1)
    const [ tokenBalance1, setTokenBalance1 ] = useState<string>('0')

    const [ token2, setToken2 ] = useState<AssetType>(initialSwapToken2)
    const [ tokenBalance2, setTokenBalance2 ] = useState<string>('')

    const SwitchHandler = () => {
        const currentToken1 = token1
        const currentToken2 = token2

        setToken1(currentToken2)
        setToken2(currentToken1)

        setSwapped(!swapped)
    }
    const variants = {
        open: { rotate: 180 },
        closed: { rotate: 0 }
    }


    // main button

    const enableBtn = () => {
        WebAppSDK.MainButton.enable()
        WebAppSDK.MainButton.show()
        WebAppSDK.MainButton.text = 'Swap'
        WebAppSDK.MainButton.textColor = WebAppSDK.themeParams.button_text_color
        WebAppSDK.MainButton.color = WebAppSDK.themeParams.button_color
        setIsValidAmount(true)

        if (!tonConnectUI.connected || Number(tokenBalance1) > Number(token1.balance)) {
            setIsValidAmount(false)
            WebAppSDK.HapticFeedback.notificationOccurred('warning')
            WebAppSDK.MainButton.disable()
            WebAppSDK.MainButton.text = 'Disabled'
            WebAppSDK.MainButton.textColor = WebAppSDK.themeParams.hint_color
            WebAppSDK.MainButton.color = WebAppSDK.themeParams.secondary_bg_color
        }
    }

    useEffect(() => {
        enableBtn()

        const handleBtnClick = () => {
            WebAppSDK.HapticFeedback.impactOccurred('medium')
            // swap logic
        }

        if (modalOpen) {
            WebAppSDK.MainButton.hide()
        }

        WebAppSDK.MainButton.onClick(handleBtnClick)

        return () => {
            WebAppSDK.MainButton.offClick(handleBtnClick)
        }
    }, [ tonConnectUI.connected, tokenBalance1, token1, token2 ])

   
    return (
        <div className={s.swapWrapper}>
            <div className={s.modalColumn}>

                <div className={s.modalContent}>
                    <Amount
                        value={tokenBalance1}
                        setValue={setTokenBalance1}
                        selectedValue={token1}
                        setIsValidAmount={setIsValidAmount}
                        setIsFromAssets={setIsFromAssets}
                        isFromAssets={isFromAssets}
                        setEstimateLoading={setEstimateLoading}
                        isModalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        isValidAmount={isValidAmount}
                    />
                    <div className={`${s.modalContentSwap}`} onClick={SwitchHandler}>
                        <motion.button
                            animate={swapped ? 'open' : 'closed'}
                            variants={variants}
                            className={`${s.swapButtonWrapper}`}
                        >
                            <SvgSelector id="swap-5" />
                        </motion.button>
                    </div>
                    <Amount
                        value={tokenBalance2}
                        setValue={setTokenBalance2}
                        selectedValue={token2}
                        onlyRead
                        setIsFromAssets={setIsFromAssets}
                        isFromAssets={isFromAssets}
                        estimateLoading={estimateLoading}
                        isModalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        isValidAmount={isValidAmount}
                    />
                </div>

                { modalOpen && (
                    <SelectAsset
                        tokensData={[]}
                        swapData={isFromAssets ? token1 : token2}
                        setSwapData={() => {}}
                        closeModal={() => {
                            WebAppSDK.HapticFeedback.impactOccurred('medium')
                            setModalOpen(false)
                        }}
                        setIsModalOpen={setModalOpen}
                        isModalOpen={modalOpen}
                    />
                ) }
            </div>
        </div>
    )
}
