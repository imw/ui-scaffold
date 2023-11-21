import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'
import FooterOnVote from '~components/Footer/FooterOnVote'
import Navbar from '~components/Navbar'

const Layout = () => {
  const location = useLocation()

  return (
    <Flex flexDirection='column' minH='100vh'>
      <Box
        bgImage={
          !location.pathname.includes('processes') && !location.pathname.includes('organization')
            ? '/assets/home-bg.jpg'
            : 'none'
        }
        bgSize='cover'
        bgRepeat='no-repeat'
      >
        <Box bgColor='rgba(255,255,255, 0.4)' minH='73vh'>
          <Flex flexDirection='column' position='relative' maxW={360} mx='auto'>
            <HStack
              w='100%'
              as='header'
              position='sticky'
              top={0}
              justifyContent='space-between'
              gap={4}
              zIndex={20}
              h={18}
              px={{ base: 2, sm: 4 }}
              backdropFilter='blur(40px)'
            >
              <Navbar />
            </HStack>

            <Box
              flexGrow={1}
              w='100%'
              as='main'
              pt={6}
              m='0 auto'
              px={{
                base: 10,
                sm: 14,
              }}
            >
              <Outlet />
            </Box>
          </Flex>
        </Box>
      </Box>

      <Text
        position='absolute'
        top='50vh'
        left={-20}
        transform='rotate(-90deg)'
        fontFamily='pixeloid'
        textTransform='uppercase'
      >
        World wide voting
      </Text>

      <Box mt='auto' bgImage={'/assets/footer-bg.jpg'} bgSize='cover' bgPosition='center'>
        <Box as='footer' w='100%' maxW={360} mx='auto' px={{ base: 2, sm: 4 }}>
          <FooterOnVote />
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout
