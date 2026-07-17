import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD, SEA_LEVEL, PAL } from './config'

/** Стилизованный океан вокруг острова: волны, блики, лёгкая пена. */
export default function Ocean() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(PAL.waterDeep) },
      uShallow: { value: new THREE.Color(PAL.waterShallow) },
      uFoam: { value: new THREE.Color(PAL.waterFoam) },
    }),
    []
  )
  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, SEA_LEVEL - 0.02, 0]} renderOrder={1}>
      <planeGeometry args={[WORLD * 4, WORLD * 4, 200, 200]} />
      <shaderMaterial
        ref={matRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec3 vN; varying float vFres; varying vec2 vUv; varying float vDist;
          float wv(float x,float z,float t){
            return sin(x*0.20+t*1.1)*0.22
                 + sin(z*0.30+t*0.9)*0.16
                 + sin((x+z)*0.42-t*1.5)*0.09
                 + sin((x-z)*0.7+t*2.1)*0.04;
          }
          void main(){
            vec3 p=position;
            float h=wv(p.x,p.y,uTime); p.z+=h;
            float e=0.5;
            float hx=wv(p.x+e,p.y,uTime)-wv(p.x-e,p.y,uTime);
            float hz=wv(p.x,p.y+e,uTime)-wv(p.x,p.y-e,uTime);
            vN=normalize(vec3(-hx,2.0*e,-hz));
            vDist=length(position.xy);
            vFres=pow(1.0-clamp(vN.y,0.0,1.0),3.0);
            vUv=position.xy;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam;
          varying vec3 vN; varying float vFres; varying vec2 vUv; varying float vDist;
          void main(){
            vec3 N=normalize(vN);
            vec3 L=normalize(vec3(0.6,0.8,0.4));
            vec3 V=vec3(0.0,1.0,0.0);
            float diff=clamp(dot(N,L),0.0,1.0);
            vec3 col=mix(uDeep,uShallow,diff*0.55+0.25);
            col=mix(col,vec3(0.72,0.85,0.95),vFres*0.5);
            float spec=pow(clamp(dot(reflect(-L,N),V),0.0,1.0),120.0);
            col+=spec*1.1;
            // лёгкая пена по гребням волн
            float crest=smoothstep(0.55,0.85,N.y==N.y?(1.0-abs(N.x)-abs(N.z)):0.0);
            float foam=smoothstep(0.6,1.0,sin(vUv.x*0.5+uTime)*0.5+0.5)*0.0;
            col=mix(col,uFoam,foam);
            float alpha=mix(0.985,0.94,clamp(vDist/200.0,0.0,1.0));
            gl_FragColor=vec4(col,alpha);
          }
        `}
      />
    </mesh>
  )
}
