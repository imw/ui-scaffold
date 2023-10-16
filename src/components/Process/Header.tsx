import { WarningIcon } from '@chakra-ui/icons'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { useReadMoreMarkdown } from '@components/Layout/use-read-more'
import {
  ElectionActions,
  ElectionDescription,
  ElectionSchedule,
  ElectionStatusBadge,
  ElectionTitle,
} from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ElectionStatus } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { ProcessDate } from './Date'

const ProcessHeader = () => {
  const { t } = useTranslation()
  const { election } = useElection()
  const { account } = useClient()
  const { ReadMoreMarkdownWrapper, ReadMoreMarkdownButton } = useReadMoreMarkdown(600, 20)

  const strategy = useStrategy()

  return (
    <Box
      mb={4}
      px={{
        base: 2,
        sm: 4,
      }}
    >
      <Flex direction={{ base: 'column', md: 'row' }} mb={7} gap={{ md: 10 }}>
        <Box flexGrow={0} flexShrink={0} flexBasis={{ base: '100%', md: '60%', lg2: '70%', xl2: '75%' }}>
          <ElectionTitle fontSize='xl4' textAlign='left' mb={5} />
          <Flex
            gap={4}
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'start', md: 'center' }}
            mb={4}
          >
            <Box>
              <ElectionStatusBadge />
            </Box>
            <ElectionSchedule textAlign='left' color='process.info_title' />
          </Flex>
          <Flex flexDirection='column'>
            <ReadMoreMarkdownWrapper from='rgba(250, 250, 250, 0)' to='rgba(250, 250, 250, 1)'>
              <ElectionDescription mb={0} fontSize='lg' lineHeight={2.5} color='process.description' />
            </ReadMoreMarkdownWrapper>
            <ReadMoreMarkdownButton colorScheme='primary' alignSelf='center' />
          </Flex>
        </Box>

        <Flex flexDirection='column' alignItems='start' gap={4} flexGrow={1}>
          {election?.status !== ElectionStatus.CANCELED ? (
            <ProcessDate />
          ) : (
            <Text color='process.canceled' fontWeight='bold'>
              {t('process.status.canceled')}
            </Text>
          )}
          {election?.electionType.anonymous && (
            <Box>
              <Text color='process.info_title' fontWeight='bold'>
                {t('process.is_anonymous.title')}
              </Text>
              <Text>{t('process.is_anonymous.description')}</Text>
            </Box>
          )}
          <Box>
            <Text color='process.info_title' fontWeight='bold'>
              {t('process.census')}
            </Text>
            <Text>{t('process.people_in_census', { count: election?.maxCensusSize })}</Text>
          </Box>
          {election?.meta?.census && (
            <Box>
              <Text color='process.info_title' fontWeight='bold'>
                {t('process.strategy')}
              </Text>
              <Text>{strategy}</Text>
            </Box>
          )}

          {election?.status === ElectionStatus.PAUSED && election?.organizationId !== account?.address && (
            <Flex
              color='process.paused'
              gap={2}
              alignItems='center'
              border='1px solid'
              borderColor='process.paused'
              borderRadius='lg'
              p={2}
            >
              <Icon as={WarningIcon} />
              <Box>
                <Text>{t('process.status.paused')}</Text>
                <Text>{t('process.status.paused_description')}</Text>
              </Box>
            </Flex>
          )}
          {election?.organizationId === account?.address && (
            <Box>
              <Text color='process.info_title' fontWeight='bold' mb={1}>
                {t('process.actions')}
              </Text>
              <ElectionActions sx={{ '& div': { flexDirection: 'row', justifyContent: 'start' } }} ml={-1} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

const useStrategy = () => {
  const { t } = useTranslation()
  const { election } = useElection()
  const strategies: { [key: string]: string } = {
    spreadsheet: t('process.census_strategies.spreadsheet'),
    token: t('process.census_strategies.token', { token: election?.meta?.token }),
    web3: t('process.census_strategies.web3'),
  }

  if (!election || (election && !election.meta.census)) return ''

  const type = election.get('census.type')

  if (typeof strategies[type] === 'undefined') {
    console.warn('unknown census type:', type)
    return ''
  }

  return strategies[type]
}

export default ProcessHeader
