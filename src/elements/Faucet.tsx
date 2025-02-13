import { Box, Card, CardBody, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import { useClient } from '@vocdoni/react-providers'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Claim } from '~components/Faucet/Claim'
import { useFaucet } from '~components/Faucet/use-faucet'

const Faucet = () => {
  const { t } = useTranslation()
  const { account } = useClient()
  const { getAuthTypes } = useFaucet()
  const [faucetAmount, setFaucetAmount] = useState<number>(0)
  const [waitHours, setWaitHours] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      try {
        const atypes = await getAuthTypes()
        if (atypes.auth.oauth) {
          setFaucetAmount(atypes.auth.oauth)
        }
        setWaitHours(Math.floor(atypes.waitSeconds / 3600))
      } catch (e) {
        setFaucetAmount(NaN)
        setWaitHours(NaN)
      }
    })()
  }, [])

  return (
    <Flex direction='column' gap={4} mt={10}>
      <Grid templateColumns={'repeat(1, 1fr)'} gap={2}>
        <GridItem display='flex' justifyContent='center' alignItems='center'>
          <Box width={'80%'}>
            <Heading as={'h1'} size={'xl'}>
              {t('faucet.title')}
            </Heading>
            <Text variant='p' mt={10} mb={10}>
              {t('faucet.description')}
            </Text>
          </Box>
        </GridItem>

        <GridItem display='flex' justifyContent='center' alignItems='center'>
          <Card width={'80%'}>
            <CardBody display='flex' flexDir='column' gap={3}>
              <Heading as={'h2'} size={'sm'}>
                {t('faucet.request_tokens.title')}
              </Heading>
              <Box>
                {account && (
                  <Text>
                    <Trans i18nKey='faucet.tokens_you_own' values={{ balance: account?.balance }} />
                  </Text>
                )}
              </Box>
              <Claim />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem display='flex' justifyContent='center' alignItems='center' mt={10}>
          <Card width={'80%'}>
            <CardBody display='flex' flexDir='column' gap={3}>
              <Heading as={'h2'} size={'sm'}>
                {t('faucet.general_information.title')}
              </Heading>
              <Text variant='p'>
                {t('faucet.general_information.description', {
                  amount: faucetAmount,
                  waitHours,
                })}
              </Text>
              <Text variant='p'>{t('faucet.general_information.description2')}</Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Faucet
