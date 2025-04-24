import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { initialPolicyMappings } from '@/data/policy-mappings';
import { enhancedPolicyMappings } from '@/data/enhanced-policy-mappings';
import { PolicyMapper } from '@/services/policy-mapper';

interface MappingRow {
  priority: string;
  mappedTerms: string[];
  sentiment: string;
  confidence: number;
  isNew?: boolean;
  unmapped?: boolean;
}

// Utility to merge and flatten mappings
function getAllMappings(unmapped: string[]): MappingRow[] {
  const merged: Record<string, MappingRow> = {};
  Object.entries({ ...initialPolicyMappings, ...enhancedPolicyMappings }).forEach(
    ([priority, mapping]: any) => {
      merged[priority] = {
        priority,
        mappedTerms: mapping.mappedTerms || [],
        sentiment: mapping.sentiment || 'neutral',
        confidence: mapping.confidence || 50,
      };
    }
  );
  unmapped.forEach(priority => {
    if (!merged[priority]) {
      merged[priority] = {
        priority,
        mappedTerms: [],
        sentiment: 'neutral',
        confidence: 50,
        unmapped: true
      };
    }
  });
  return Object.values(merged);
}

export const PriorityMappingEditor: React.FC = () => {
  const [unmapped, setUnmapped] = useState<string[]>([]);
  const [policyMapper] = useState(() => new PolicyMapper());
  useEffect(() => {
    setUnmapped(policyMapper.getTermsNeedingMapping());
  }, [policyMapper]);
  const [mappings, setMappings] = useState<MappingRow[]>(getAllMappings(unmapped));
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<MappingRow | null>(null);
  const [newRow, setNewRow] = useState<MappingRow>({ priority: '', mappedTerms: [''], sentiment: 'neutral', confidence: 50, isNew: true });
  useEffect(() => {
    setMappings(getAllMappings(unmapped));
  }, [unmapped]);
  const handleAdd = () => {
    if (!newRow.priority.trim()) return;
    setMappings([...mappings, { ...newRow, isNew: false, unmapped: false }]);
    setNewRow({ priority: '', mappedTerms: [''], sentiment: 'neutral', confidence: 50, isNew: true });
    setUnmapped(unmapped.filter(u => u !== newRow.priority));
  };
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditRow({ ...mappings[idx] });
  };
  const handleSave = (idx: number) => {
    if (!editRow) return;
    const updated = [...mappings];
    updated[idx] = { ...editRow, isNew: false, unmapped: false };
    setMappings(updated);
    setEditIdx(null);
    setEditRow(null);
    setUnmapped(unmapped.filter(u => u !== editRow.priority));
  };
  const handleDelete = (idx: number) => {
    setMappings(mappings.filter((_, i) => i !== idx));
    setEditIdx(null);
    setEditRow(null);
  };
  const updateEditField = (field: keyof MappingRow, value: any) => {
    if (!editRow) return;
    setEditRow({ ...editRow, [field]: value });
  };
  const updateNewField = (field: keyof MappingRow, value: any) => {
    setNewRow({ ...newRow, [field]: value });
  };
  const addTermField = (rowType: 'edit' | 'new') => {
    if (rowType === 'edit' && editRow) {
      setEditRow({ ...editRow, mappedTerms: [...editRow.mappedTerms, ''] });
    } else if (rowType === 'new') {
      setNewRow({ ...newRow, mappedTerms: [...newRow.mappedTerms, ''] });
    }
  };
  const removeTermField = (rowType: 'edit' | 'new', idx: number) => {
    if (rowType === 'edit' && editRow) {
      setEditRow({ ...editRow, mappedTerms: editRow.mappedTerms.filter((_, i) => i !== idx) });
    } else if (rowType === 'new') {
      setNewRow({ ...newRow, mappedTerms: newRow.mappedTerms.filter((_, i) => i !== idx) });
    }
  };
  useEffect(() => {
    function onRandomPersonaMapped(e: any) {
      if (e.detail && e.detail.priority) {
        if (!mappings.some(m => m.priority === e.detail.priority)) {
          setMappings(prev => [...prev, { priority: e.detail.priority, mappedTerms: e.detail.mappedTerms || [], sentiment: 'neutral', confidence: 50, isNew: false, unmapped: false }]);
        }
        setUnmapped(prev => prev.filter(u => u !== e.detail.priority));
      }
    }
    window.addEventListener('randomPersonaMapped', onRandomPersonaMapped);
    return () => {
      window.removeEventListener('randomPersonaMapped', onRandomPersonaMapped);
    };
  }, [mappings]);

  // --- Redesigned UI for policy experts ---
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Priority Mapping Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mappings.map((row, idx) => (
            <div key={row.priority} className={`rounded-lg border p-4 mb-2 ${row.unmapped ? 'bg-yellow-50' : 'bg-white'}`}>  
              {editIdx === idx ? (
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      value={editRow?.priority || ''}
                      onChange={e => updateEditField('priority', e.target.value)}
                      className="w-full md:w-1/3"
                      placeholder="Priority statement"
                    />
                    <div className="flex flex-col gap-1 w-full md:w-1/3">
                      {editRow?.mappedTerms.map((term, tIdx) => (
                        <div key={tIdx} className="flex gap-1 items-center">
                          <Input
                            value={term}
                            onChange={e => {
                              const updated = [...(editRow?.mappedTerms || [])];
                              updated[tIdx] = e.target.value;
                              updateEditField('mappedTerms', updated);
                            }}
                            className="w-32"
                            placeholder="Policy term"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeTermField('edit', tIdx)}>-</Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addTermField('edit')}>+ Term</Button>
                    </div>
                    <div className="flex flex-col gap-1 w-full md:w-1/6">
                      <Input
                        value={editRow?.sentiment || ''}
                        onChange={e => updateEditField('sentiment', e.target.value)}
                        className="w-24"
                        placeholder="Sentiment"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={editRow?.confidence || 50}
                        onChange={e => updateEditField('confidence', Number(e.target.value))}
                        className="w-24 mt-1"
                        placeholder="Confidence %"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleSave(idx)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditIdx(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <div className="w-full md:w-1/3">
                    <strong>Priority:</strong> {row.priority}
                  </div>
                  <div className="w-full md:w-1/3">
                    <strong>Policy Terms:</strong> {row.mappedTerms.join(', ')}
                  </div>
                  <div className="w-full md:w-1/6">
                    <strong>Sentiment:</strong> {row.sentiment}
                  </div>
                  <div className="w-full md:w-1/6">
                    <strong>Confidence:</strong> {row.confidence}%
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(idx)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(idx)}>Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* New mapping row */}
          <div className="rounded-lg border p-4 bg-muted">
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                value={newRow.priority}
                onChange={e => updateNewField('priority', e.target.value)}
                className="w-full md:w-1/3"
                placeholder="New priority statement"
              />
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                {newRow.mappedTerms.map((term, tIdx) => (
                  <div key={tIdx} className="flex gap-1 items-center">
                    <Input
                      value={term}
                      onChange={e => {
                        const updated = [...(newRow.mappedTerms || [])];
                        updated[tIdx] = e.target.value;
                        updateNewField('mappedTerms', updated);
                      }}
                      className="w-32"
                      placeholder="Policy term"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeTermField('new', tIdx)}>-</Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => addTermField('new')}>+ Term</Button>
              </div>
              <div className="flex flex-col gap-1 w-full md:w-1/6">
                <Input
                  value={newRow.sentiment}
                  onChange={e => updateNewField('sentiment', e.target.value)}
                  className="w-24"
                  placeholder="Sentiment"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={newRow.confidence}
                  onChange={e => updateNewField('confidence', Number(e.target.value))}
                  className="w-24 mt-1"
                  placeholder="Confidence %"
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button variant="outline" size="sm" onClick={handleAdd}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
