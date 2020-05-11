import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { PersonaleStore } from '#/stores'
import { IPersonale } from '@/clients/mongo/models/personale'

export function Personale({ imei }) {
  let [personale, setPersonale] = useState<IPersonale | null>(null)
  useEffectOnce(() => {
    PersonaleStore.getPersonaleByImei(imei).then((p) => setPersonale(p))
  })

  return personale ? (
    <a href={`/personales/${personale?.id}`} target="__blank">
      {personale.name}
    </a>
  ) : (
    <span>{imei}</span>
  )
}
