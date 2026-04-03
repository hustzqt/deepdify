import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { BrandAnalysisHistoryCard } from '@/components/brands/BrandAnalysisHistoryCard'

const sampleItem = {
  id: 'hist-1',
  createdAt: '2026-03-28T12:00:00.000Z',
  result: {
    brand_positioning: {
      core_value: 'Test value',
      differentiation: 'Diff',
      personality_traits: ['a'],
    },
    target_audience_analysis: {
      primary_demographic: '',
      pain_points: [],
      aspirations: [],
    },
    brand_voice: { tone: '', communication_style: '', sample_tagline: '' },
    visual_direction: {
      color_palette_suggestion: [],
      style_keywords: [],
      typography_suggestion: '',
    },
    confidence_score: 0.72,
  },
}

function ControlledCard() {
  const [expanded, setExpanded] = useState(false)
  return (
    <BrandAnalysisHistoryCard
      item={sampleItem}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
    />
  )
}

describe('BrandAnalysisHistoryCard', () => {
  it('shows summary and expands to reveal analysis region', async () => {
    const user = userEvent.setup()
    render(<ControlledCard />)

    expect(screen.getByText(/置信度：72%/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /展开详情/ }))
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByText('Test value')).toBeInTheDocument()
  })
})
