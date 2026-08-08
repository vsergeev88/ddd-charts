import { Suspense, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { Group } from 'three'
import type {
  BloomConfig,
  BloomProp,
  ChartViewerProps,
  ContactShadowsConfig,
  EnvironmentPreset,
  LightingConfig,
  Vec3
} from '../types'
import { resolveAutoRotate, resolveControls, type ResolvedAutoRotate } from '../utils/normalize'

const DEFAULT_BLOOM: Required<BloomConfig> = {
  intensity: 1.1,
  luminanceThreshold: 1.5,
  luminanceSmoothing: 0.25,
  mipmapBlur: true,
  levels: 5,
  radius: 0.65
}

function resolveBloom(bloom: BloomProp | undefined): Required<BloomConfig> | false {
  if (!bloom) return false
  if (bloom === true) return DEFAULT_BLOOM
  return {
    intensity: bloom.intensity ?? DEFAULT_BLOOM.intensity,
    luminanceThreshold: bloom.luminanceThreshold ?? DEFAULT_BLOOM.luminanceThreshold,
    luminanceSmoothing: bloom.luminanceSmoothing ?? DEFAULT_BLOOM.luminanceSmoothing,
    mipmapBlur: bloom.mipmapBlur ?? DEFAULT_BLOOM.mipmapBlur,
    levels: bloom.levels ?? DEFAULT_BLOOM.levels,
    radius: bloom.radius ?? DEFAULT_BLOOM.radius
  }
}

interface AutoRotateGroupProps {
  autoRotate: ResolvedAutoRotate
  children: ReactNode
}

function AutoRotateGroup({ autoRotate, children }: AutoRotateGroupProps) {
  const groupRef = useRef<Group>(null)
  useFrame((_, delta) => {
    if (autoRotate.enabled && groupRef.current) {
      groupRef.current.rotation.y += autoRotate.speed * delta
    }
  })
  return <group ref={groupRef}>{children}</group>
}

interface StageLightsProps {
  lighting?: LightingConfig | false
  shadows: boolean
}

function StageLights({ lighting, shadows }: StageLightsProps) {
  if (lighting === false) return null
  const {
    ambientIntensity = 0.5,
    directionalIntensity = 1.4,
    directionalPosition = [6, 10, 6] as Vec3,
    castShadow = shadows
  } = lighting ?? {}

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        castShadow={castShadow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.35} />
    </>
  )
}

export interface ChartStageProps {
  children: ReactNode
  autoRotate?: ChartViewerProps['autoRotate']
  controls?: ChartViewerProps['controls']
  environment?: EnvironmentPreset | false
  lighting?: LightingConfig | false
  shadows?: boolean
  contactShadows?: boolean | ContactShadowsConfig
  bloom?: BloomProp
  target?: Vec3
}

export function ChartStage({
  children,
  autoRotate,
  controls,
  environment = 'city',
  lighting,
  shadows = true,
  contactShadows = true,
  bloom,
  target = [0, 0, 0]
}: ChartStageProps) {
  const rotate = resolveAutoRotate(autoRotate)
  const orbit = resolveControls(controls)
  const bloomSettings = resolveBloom(bloom)
  const shadowConfig: ContactShadowsConfig =
    typeof contactShadows === 'object' ? contactShadows : {}

  return (
    <>
      <StageLights lighting={lighting} shadows={shadows} />
      {environment !== false && (
        <Suspense fallback={null}>
          <Environment preset={environment} />
        </Suspense>
      )}
      <AutoRotateGroup autoRotate={rotate}>{children}</AutoRotateGroup>
      {contactShadows !== false && (
        <ContactShadows
          position={shadowConfig.position ?? [0, -0.01, 0]}
          opacity={shadowConfig.opacity ?? 0.45}
          blur={shadowConfig.blur ?? 2.2}
          scale={shadowConfig.scale ?? 14}
          far={shadowConfig.far ?? 6}
        />
      )}
      {orbit.enabled && (
        <OrbitControls
          target={target}
          enablePan={orbit.enablePan}
          enableZoom={orbit.enableZoom}
          enableRotate={orbit.enableRotate}
          enableDamping={orbit.enableDamping}
          dampingFactor={orbit.dampingFactor}
          minDistance={orbit.minDistance}
          maxDistance={orbit.maxDistance}
          minPolarAngle={orbit.minPolarAngle}
          maxPolarAngle={orbit.maxPolarAngle}
          makeDefault
        />
      )}
      {bloomSettings && (
        <EffectComposer>
          <Bloom
            intensity={bloomSettings.intensity}
            luminanceThreshold={bloomSettings.luminanceThreshold}
            luminanceSmoothing={bloomSettings.luminanceSmoothing}
            mipmapBlur={bloomSettings.mipmapBlur}
            levels={bloomSettings.levels}
            radius={bloomSettings.radius}
          />
        </EffectComposer>
      )}
    </>
  )
}

export function ChartViewer({
  children,
  camera,
  autoRotate,
  controls,
  environment = 'city',
  lighting,
  shadows = true,
  contactShadows = true,
  bloom,
  background,
  className,
  style,
  canvasProps
}: ChartViewerProps) {
  const cameraSettings = useMemo(
    () => ({
      position: camera?.position ?? ([5, 4, 7] as Vec3),
      fov: camera?.fov ?? 45,
      near: camera?.near ?? 0.1,
      far: camera?.far ?? 200,
      zoom: camera?.zoom ?? 1
    }),
    [camera?.position, camera?.fov, camera?.near, camera?.far, camera?.zoom]
  )

  return (
    <Canvas
      shadows={shadows}
      dpr={[1, 2]}
      camera={cameraSettings}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
      {...canvasProps}
    >
      {background && <color attach="background" args={[background]} />}
      <ChartStage
        autoRotate={autoRotate}
        controls={controls}
        environment={environment}
        lighting={lighting}
        shadows={shadows}
        contactShadows={contactShadows}
        bloom={bloom}
        target={camera?.target}
      >
        {children}
      </ChartStage>
    </Canvas>
  )
}
